<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\SupplierController;
use App\Http\Controllers\Api\V1\PurchaseOrderController;
use App\Http\Controllers\Api\V1\PosController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// API Version 1 Routes
Route::prefix('v1')->group(function () {
    // Public endpoints
    Route::get('/ping', [HealthController::class, 'ping']);
    Route::get('/health', [HealthController::class, 'health']);

    // Protected endpoints
    Route::middleware('auth:sanctum')->group(function () {
        // System info
        Route::get('/system/info', [HealthController::class, 'info'])
            ->middleware(['role:admin,owner']);

        // User management
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->middleware(['permission:users.view,users.manage']);
            Route::post('/', [UserController::class, 'store'])->middleware(['permission:users.create,users.manage']);
            Route::get('/{id}', [UserController::class, 'show'])->middleware(['permission:users.view,users.manage']);
            Route::put('/{id}', [UserController::class, 'update'])->middleware(['permission:users.update,users.manage']);
            Route::patch('/{id}/status', [UserController::class, 'updateStatus'])->middleware(['permission:users.suspend,users.manage']);
            Route::delete('/{id}', [UserController::class, 'destroy'])->middleware(['permission:users.delete,users.manage']);
        });

        // Profile
        Route::prefix('profile')->group(function () {
            Route::get('/', [UserController::class, 'profile']);
            Route::put('/', [UserController::class, 'updateProfile']);
            Route::post('/password', [UserController::class, 'changePassword']);
        });

        // Categories (Phase 3)
        Route::prefix('categories')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::get('/tree', [CategoryController::class, 'tree'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::post('/', [CategoryController::class, 'store'])->middleware(['permission:catalog.create,catalog.manage']);
            Route::get('/{id}', [CategoryController::class, 'show'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::put('/{id}', [CategoryController::class, 'update'])->middleware(['permission:catalog.update,catalog.manage']);
            Route::delete('/{id}', [CategoryController::class, 'destroy'])->middleware(['permission:catalog.delete,catalog.manage']);
        });

        // Brands (Phase 3)
        Route::prefix('brands')->group(function () {
            Route::get('/', [BrandController::class, 'index'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::post('/', [BrandController::class, 'store'])->middleware(['permission:catalog.create,catalog.manage']);
            Route::get('/{id}', [BrandController::class, 'show'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::put('/{id}', [BrandController::class, 'update'])->middleware(['permission:catalog.update,catalog.manage']);
            Route::delete('/{id}', [BrandController::class, 'destroy'])->middleware(['permission:catalog.delete,catalog.manage']);
        });

        // Products (Phase 3)
        Route::prefix('products')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::post('/', [ProductController::class, 'store'])->middleware(['permission:catalog.create,catalog.manage']);
            Route::get('/{id}', [ProductController::class, 'show'])->middleware(['permission:catalog.view,catalog.manage']);
            Route::put('/{id}', [ProductController::class, 'update'])->middleware(['permission:catalog.update,catalog.manage']);
            Route::delete('/{id}', [ProductController::class, 'destroy'])->middleware(['permission:catalog.delete,catalog.manage']);
            Route::post('/{id}/variants', [ProductController::class, 'addVariant'])->middleware(['permission:catalog.update,catalog.manage']);
            Route::post('/{id}/images', [ProductController::class, 'uploadImages'])->middleware(['permission:catalog.update,catalog.manage']);
        });

        // Inventory (Phase 4)
        Route::prefix('inventory')->group(function () {
            Route::get('/', [InventoryController::class, 'index'])->middleware(['permission:inventory.view,inventory.manage']);
            Route::get('/{variant_id}', [InventoryController::class, 'show'])->middleware(['permission:inventory.view,inventory.manage']);
            Route::post('/adjust', [InventoryController::class, 'adjust'])->middleware(['permission:inventory.adjust,inventory.manage']);
            Route::get('/movements', [InventoryController::class, 'movements'])->middleware(['permission:inventory.view,inventory.manage']);
            Route::get('/low-stock', [InventoryController::class, 'lowStock'])->middleware(['permission:inventory.view,inventory.manage']);
        });

        // Serial Numbers (Phase 4)
        Route::prefix('serials')->group(function () {
            Route::post('/register', [InventoryController::class, 'registerSerial'])->middleware(['permission:serials.manage,inventory.manage']);
            Route::get('/{code}', [InventoryController::class, 'getSerial'])->middleware(['permission:inventory.view,inventory.manage']);
        });

        // Suppliers (Phase 5)
        Route::prefix('suppliers')->group(function () {
            Route::get('/', [SupplierController::class, 'index'])->middleware(['permission:suppliers.view,suppliers.manage']);
            Route::post('/', [SupplierController::class, 'store'])->middleware(['permission:suppliers.create,suppliers.manage']);
            Route::get('/{id}', [SupplierController::class, 'show'])->middleware(['permission:suppliers.view,suppliers.manage']);
            Route::put('/{id}', [SupplierController::class, 'update'])->middleware(['permission:suppliers.update,suppliers.manage']);
            Route::delete('/{id}', [SupplierController::class, 'destroy'])->middleware(['permission:suppliers.delete,suppliers.manage']);
            Route::post('/{id}/contacts', [SupplierController::class, 'addContact'])->middleware(['permission:suppliers.update,suppliers.manage']);
            Route::get('/{id}/purchase-history', [SupplierController::class, 'purchaseHistory'])->middleware(['permission:suppliers.view,suppliers.manage']);
        });

        // Purchase Orders (Phase 6)
        Route::prefix('purchases')->group(function () {
            Route::get('/', [PurchaseOrderController::class, 'index'])->middleware(['permission:purchases.view,purchases.manage']);
            Route::post('/', [PurchaseOrderController::class, 'store'])->middleware(['permission:purchases.create,purchases.manage']);
            Route::get('/{id}', [PurchaseOrderController::class, 'show'])->middleware(['permission:purchases.view,purchases.manage']);
            Route::put('/{id}', [PurchaseOrderController::class, 'update'])->middleware(['permission:purchases.update,purchases.manage']);
            Route::post('/{id}/approve', [PurchaseOrderController::class, 'approve'])->middleware(['permission:purchases.approve,purchases.manage']);
            Route::post('/{id}/receive', [PurchaseOrderController::class, 'receive'])->middleware(['permission:purchases.receive,purchases.manage']);
            Route::post('/{id}/cancel', [PurchaseOrderController::class, 'cancel'])->middleware(['permission:purchases.cancel,purchases.manage']);
            Route::get('/{id}/pdf', [PurchaseOrderController::class, 'generatePdf'])->middleware(['permission:purchases.view,purchases.manage']);
        });

        // POS Sales (Phase 7)
        Route::prefix('pos')->group(function () {
            Route::get('/cart', [PosController::class, 'getCart'])->middleware(['permission:pos.cart.manage,pos.checkout']);
            Route::post('/cart', [PosController::class, 'addToCart'])->middleware(['permission:pos.cart.manage,pos.checkout']);
            Route::put('/cart', [PosController::class, 'updateCart'])->middleware(['permission:pos.cart.manage,pos.checkout']);
            Route::delete('/cart', [PosController::class, 'clearCart'])->middleware(['permission:pos.cart.manage,pos.checkout']);
            Route::post('/checkout', [PosController::class, 'checkout'])->middleware(['permission:pos.checkout']);
            Route::get('/sales', [PosController::class, 'salesHistory'])->middleware(['permission:pos.view_history']);
            Route::get('/sales/{id}', [PosController::class, 'saleDetails'])->middleware(['permission:pos.view_history']);
            Route::post('/sales/{id}/refund', [PosController::class, 'refund'])->middleware(['permission:pos.refund.process']);
        });

        // Discounts (Phase 7)
        Route::prefix('discounts')->group(function () {
            Route::get('/validate', [PosController::class, 'validateDiscount'])->middleware(['permission:pos.discount.apply,pos.checkout']);
        });
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
