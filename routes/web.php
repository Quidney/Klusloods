<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('admin')->group(function(){
    Route::get('/tools',[ProductController::class,'index'])->name('tools.index');
    Route::put('/tools',[ProductController::class,'update'])->name('tools.update');
    Route::post('/barcodes',[ProductController::class,'store'])->name('tools.barcode.add');
    Route::put('/barcodes',[ProductController::class,'edit'])->name('tools.barcode.update');

   });
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
