<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Warranty;
use App\Models\WarrantyClaim;
use App\Models\RepairJob;
use App\Models\Sale;
use App\Models\SerialNumber;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CustomerService
{
    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);
        return $customer->fresh();
    }

    public function getWithHistory(int $customerId): Customer
    {
        return Customer::with([
            'sales.items.variant.product.brand',
            'warranties.serial.variant.product'
        ])->findOrFail($customerId);
    }

    public function search(string $query, int $perPage = 20)
    {
        return Customer::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->orderBy('name')
            ->paginate($perPage);
    }
}

class WarrantyService
{
    public function generateForSale(Sale $sale): void
    {
        DB::transaction(function () use ($sale) {
            foreach ($sale->items as $item) {
                $product = $item->variant->product;
                $warrantyMonths = $product->warranty_months ?? 0;

                if ($warrantyMonths <= 0 || !$item->serial) {
                    continue;
                }

                // Check if warranty already exists for this serial
                $existing = Warranty::where('serial_id', $item->serial_id)->first();
                if ($existing) {
                    continue;
                }

                Warranty::create([
                    'sale_id' => $sale->id,
                    'serial_id' => $item->serial_id,
                    'customer_id' => $sale->customer_id,
                    'start_date' => $sale->completed_at ?? now(),
                    'end_date' => (clone ($sale->completed_at ?? now()))->addMonths($warrantyMonths),
                    'status' => 'active',
                    'terms' => $product->warranty_terms ?? null,
                ]);
            }
        });
    }

    public function getBySerial(string $serialCode): ?Warranty
    {
        $serial = SerialNumber::where('serial_code', $serialCode)->first();
        
        if (!$serial) {
            return null;
        }

        return Warranty::where('serial_id', $serial->id)
            ->with(['sale', 'serial.variant.product', 'customer', 'claims.repairJob'])
            ->latest()
            ->first();
    }

    public function validateClaim(Warranty $warranty): array
    {
        $isValid = $warranty->canClaim();
        $reasons = [];

        if (!$isValid) {
            if ($warranty->isExpired()) {
                $reasons[] = 'Warranty has expired';
            }
            if ($warranty->status === 'void') {
                $reasons[] = 'Warranty has been voided';
            }
            if ($warranty->status === 'claimed') {
                $reasons[] = 'Warranty already claimed';
            }
        }

        // Check for active claims
        $activeClaim = $warranty->claims()->where('status', 'pending')->exists();
        if ($activeClaim) {
            $isValid = false;
            $reasons[] = 'Active claim already exists for this item';
        }

        return [
            'valid' => $isValid,
            'reasons' => $reasons,
            'warranty' => $warranty,
        ];
    }

    public function submitClaim(Warranty $warranty, User $user, string $reason, ?string $customerDescription = null): WarrantyClaim
    {
        $validation = $this->validateClaim($warranty);

        if (!$validation['valid']) {
            throw new \InvalidArgumentException(implode(', ', $validation['reasons']));
        }

        return DB::transaction(function () use ($warranty, $user, $reason, $customerDescription) {
            $claim = WarrantyClaim::create([
                'warranty_id' => $warranty->id,
                'reason' => $reason,
                'customer_description' => $customerDescription,
                'submitted_by' => $user->id,
            ]);

            // Update warranty status
            $warranty->update(['status' => 'claimed']);

            return $claim;
        });
    }

    public function approveClaim(WarrantyClaim $claim, ?User $technician = null): RepairJob
    {
        return DB::transaction(function () use ($claim, $technician) {
            $claim->approve();

            $repairJob = RepairJob::create([
                'claim_id' => $claim->id,
                'serial_id' => $claim->warranty->serial_id,
                'status' => 'received',
                'technician_id' => $technician?->id,
            ]);

            return $repairJob;
        });
    }

    public function rejectClaim(WarrantyClaim $claim, string $rejectionReason): WarrantyClaim
    {
        $claim->reject();
        
        // Revert warranty status if no other active claims
        $warranty = $claim->warranty;
        $hasOtherActiveClaims = $warranty->claims()
            ->where('id', '!=', $claim->id)
            ->where('status', 'pending')
            ->exists();

        if (!$hasOtherActiveClaims) {
            $warranty->update(['status' => 'active']);
        }

        return $claim;
    }

    public function voidWarranty(Warranty $warranty, string $reason): Warranty
    {
        $warranty->update([
            'status' => 'void',
            'terms' => ($warranty->terms ?? '') . " | Voided: {$reason}",
        ]);

        return $warranty;
    }

    public function getExpiringSoon(int $days = 30)
    {
        $cutoff = now()->addDays($days);

        return Warranty::where('status', 'active')
            ->where('end_date', '<=', $cutoff)
            ->where('end_date', '>=', now())
            ->with(['customer', 'serial.variant.product'])
            ->orderBy('end_date')
            ->get();
    }
}

class RepairService
{
    public function updateStatus(RepairJob $job, string $status, ?string $diagnosis = null, ?float $cost = null): RepairJob
    {
        $data = ['status' => $status];

        if ($diagnosis !== null) {
            $data['diagnosis'] = $diagnosis;
        }

        if ($cost !== null) {
            $data['repair_cost'] = $cost;
        }

        if ($status === 'ready' || $status === 'completed') {
            $data['estimated_completion'] = now();
        }

        $job->update($data);

        return $job->fresh();
    }

    public function getOverdueJobs()
    {
        return RepairJob::where('status', '!=', 'completed')
            ->where('status', '!=', 'cancelled')
            ->where('created_at', '<', now()->subDays(RepairJob::SLA_DAYS))
            ->with(['claim.warranty.serial.variant.product', 'technician'])
            ->orderBy('created_at')
            ->get();
    }

    public function getByTechnician(int $technicianId, ?string $status = null)
    {
        $query = RepairJob::where('technician_id', $technicianId);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->with(['claim.warranty', 'serial.variant'])
            ->orderByDesc('updated_at')
            ->paginate(20);
    }

    public function getStats(): array
    {
        $total = RepairJob::count();
        $completed = RepairJob::where('status', 'completed')->count();
        $inProgress = RepairJob::whereIn('status', ['received', 'diagnosing', 'repairing'])->count();
        $ready = RepairJob::where('status', 'ready')->count();
        $overdue = $this->getOverdueJobs()->count();

        $avgCompletionDays = RepairJob::where('status', 'completed')
            ->selectRaw('AVG(DATEDIFF(updated_at, created_at)) as avg_days')
            ->value('avg_days') ?? 0;

        return [
            'total' => $total,
            'completed' => $completed,
            'in_progress' => $inProgress,
            'ready_for_pickup' => $ready,
            'overdue' => $overdue,
            'avg_completion_days' => round($avgCompletionDays, 1),
        ];
    }
}
