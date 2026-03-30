<?php

use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
Route::prefix('medewerker')->group(function(){
    Route::get('/uitgifte-registreren',[EmployeeController::class, 'index']);
    Route::patch('/reservations/{reservation}',[EmployeeController::class, 'update']);

});

require __DIR__.'/settings.php';
