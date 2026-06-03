<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Events\SaleCompleted;
use App\Listeners\GenerateWarranty;
use App\Listeners\DeductInventory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repositories to interfaces if needed
        $this->app->bind(
            \App\Repositories\ProductRepositoryInterface::class,
            \App\Repositories\ProductRepository::class
        );
        $this->app->bind(
            \App\Repositories\InventoryRepositoryInterface::class,
            \App\Repositories\InventoryRepository::class
        );
        $this->app->bind(
            \App\Repositories\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register event listeners
        Event::listen([
            SaleCompleted::class => [
                GenerateWarranty::class,
                DeductInventory::class,
            ],
        ]);
    }
}
