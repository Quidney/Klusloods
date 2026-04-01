<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\CategorieController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReserveringController;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('admin')->group(function(){
    Route::get('/category',[CategorieController::class,'index'])->name('category');
    Route::put('/category',[CategorieController::class,'update'])->name('category.update');
    Route::delete('/category/{id}',[CategorieController::class,'destroy'])->name('category.destroy');
    Route::post('/category',[CategorieController::class,'store'])->name('category.store');
    Route::get('/tools',[ProductController::class,'index'])->name('tools.index');
    Route::put('/tools',[ProductController::class,'update'])->name('tools.update');
    Route::post('/tools',[ProductController::class,'create'])->name('tools.create');
    Route::delete('/tools/{id}',[ProductController::class,'destroy'])->name('tools.destroy');
    Route::post('/barcodes',[ProductController::class,'store'])->name('tools.barcode.add');
    Route::put('/barcodes',[ProductController::class,'edit'])->name('tools.barcode.update');
    Route::get('users',[UserController::class,'index'])->name('users');
    Route::put('users',[UserController::class,'update'])->name('users.update');
});

Route::get('/klant/producten',[ReserveringController::class,'index'])->name('reservering.index'); 
Route::get('/klant/product/{id}', [ReserveringController::class, 'show'])->name('reservering.show');
Route::post('/klant/reserveren', [ReserveringController::class, 'store']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
