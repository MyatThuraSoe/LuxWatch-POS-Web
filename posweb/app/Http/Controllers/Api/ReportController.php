<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Http\Requests\ReportFilterRequest;
use App\Http\Requests\ExportRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * GET /api/v1/reports/dashboard
     */
    public function dashboard(Request $request)
    {
        $startDate = $request->filled('start_date') ? now()->parse($request->start_date) : null;
        $endDate = $request->filled('end_date') ? now()->parse($request->end_date) : null;

        $kpis = $this->reportService->getDashboardKPIs($startDate, $endDate);

        return $this->success($kpis, 'Dashboard KPIs retrieved successfully');
    }

    /**
     * GET /api/v1/reports/sales
     */
    public function sales(ReportFilterRequest $request)
    {
        $report = $this->reportService->getSalesReport($request->validated());
        
        return $this->success($report, 'Sales report retrieved successfully');
    }

    /**
     * GET /api/v1/reports/financial
     */
    public function financial(ReportFilterRequest $request)
    {
        $this->authorize('view_financial', \App\Models\Sale::class);
        
        $report = $this->reportService->getFinancialReport($request->validated());
        
        return $this->success($report, 'Financial report retrieved successfully');
    }

    /**
     * GET /api/v1/reports/inventory
     */
    public function inventory(Request $request)
    {
        $this->authorize('view_inventory', \App\Models\InventoryItem::class);
        
        // Simple inventory report implementation
        $inventory = \App\Models\InventoryItem::with('variant.product.brand')
            ->orderBy('quantity', 'asc')
            ->paginate(20);
            
        return $this->success([
            'data' => $inventory->items(),
            'pagination' => [
                'current_page' => $inventory->currentPage(),
                'last_page' => $inventory->lastPage(),
                'per_page' => $inventory->perPage(),
                'total' => $inventory->total(),
            ]
        ], 'Inventory report retrieved successfully');
    }

    /**
     * GET /api/v1/reports/employees
     */
    public function employees(ReportFilterRequest $request)
    {
        $user = Auth::user();
        $report = $this->reportService->getEmployeePerformance($user, $request->validated());
        
        return $this->success($report, 'Employee performance report retrieved successfully');
    }

    /**
     * POST /api/v1/reports/export
     */
    public function export(ExportRequest $request)
    {
        $user = Auth::user();
        
        $export = $this->reportService->generateExport(
            $request->report,
            $request->filters ?? [],
            $user->id
        );
        
        return $this->success([
            'export_id' => $export->id,
            'status' => $export->status,
            'estimated_time' => '15s',
        ], 'Export job queued successfully', 202);
    }

    /**
     * GET /api/v1/reports/exports/{id}/download
     */
    public function download($id)
    {
        $export = \App\Models\ReportExport::findOrFail($id);
        
        // Check ownership or admin
        if ($export->user_id !== Auth::id() && !Auth::user()->hasRole(['ADMIN', 'OWNER'])) {
            return $this->error('Unauthorized access to export file', 403);
        }
        
        if ($export->status !== 'completed') {
            return $this->error('Export not ready yet', 400);
        }
        
        if ($export->isExpired()) {
            return $this->error('Export link has expired', 410);
        }
        
        $url = $export->download_url;
        
        if (!$url) {
            return $this->error('File not found', 404);
        }
        
        return $this->success(['download_url' => $url], 'Download URL generated successfully');
    }
}
