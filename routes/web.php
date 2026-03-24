<?php

use App\Http\Controllers\CategorieController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('admin')->group(function(){
    Route::get('/category',[CategorieController::class,'index'])->name('category');
    Route::put('/category',[CategorieController::class,'update'])->name('category.update');
    Route::delete('/category/{id}',[CategorieController::class,'destroy'])->name('category.destroy');
    Route::post('/category',[CategorieController::class,'store'])->name('category.store');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
