<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API Version 1 Routes
Route::prefix('v1')->group(function () {
    // Public endpoints (no authentication required)
    Route::get('/ping', [HealthController::class, 'ping']);
    Route::get('/health', [HealthController::class, 'health']);
    
    // Authentication endpoints
    // Route::post('/auth/login', [AuthController::class, 'login']);
    
    // Protected endpoints (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        // Route::post('/auth/logout', [AuthController::class, 'logout']);
        // Route::get('/auth/me', [AuthController::class, 'me']);
        // Route::post('/auth/refresh', [AuthController::class, 'refresh']);
        
        // System info (Admin/Owner only)
        Route::get('/system/info', [HealthController::class, 'info'])
            ->middleware(['role:admin,owner']);
        
        // User management routes
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])
                ->middleware(['permission:users.view,users.manage']);
            Route::post('/', [UserController::class, 'store'])
                ->middleware(['permission:users.create,users.manage']);
            Route::get('/{id}', [UserController::class, 'show'])
                ->middleware(['permission:users.view,users.manage']);
            Route::put('/{id}', [UserController::class, 'update'])
                ->middleware(['permission:users.update,users.manage']);
            Route::patch('/{id}/status', [UserController::class, 'updateStatus'])
                ->middleware(['permission:users.suspend,users.manage']);
            Route::delete('/{id}', [UserController::class, 'destroy'])
                ->middleware(['permission:users.delete,users.manage']);
        });
        
        // Profile routes (for authenticated user)
        Route::prefix('profile')->group(function () {
            Route::get('/', [UserController::class, 'profile']);
            Route::put('/', [UserController::class, 'updateProfile']);
            Route::post('/password', [UserController::class, 'changePassword']);
        });
        
        // Role management routes (Admin/Owner only) - TODO: Create RoleController
        // Route::prefix('roles')->group(function () {
        //     Route::get('/', [RoleController::class, 'index'])
        //         ->middleware(['permission:roles.view,roles.manage']);
        //     Route::post('/', [RoleController::class, 'store'])
        //         ->middleware(['permission:roles.create,roles.manage']);
        //     Route::get('/{id}', [RoleController::class, 'show'])
        //         ->middleware(['permission:roles.view,roles.manage']);
        //     Route::put('/{id}', [RoleController::class, 'update'])
        //         ->middleware(['permission:roles.update,roles.manage']);
        //     Route::delete('/{id}', [RoleController::class, 'destroy'])
        //         ->middleware(['permission:roles.delete,roles.manage']);
        // });
        
        // Permission routes (Admin/Owner only) - TODO: Create RoleController
        // Route::prefix('permissions')->group(function () {
        //     Route::get('/', [RoleController::class, 'indexPermissions'])
        //         ->middleware(['permission:permissions.view,permissions.manage']);
        // });
        
        // User role assignment (Admin/Owner only) - TODO: Create RoleController
        // Route::post('/users/{id}/roles', [RoleController::class, 'assignRoles'])
        //     ->middleware(['permission:roles.manage']);
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
