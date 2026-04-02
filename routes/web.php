<?php

use App\Http\Controllers\StatController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\FacturenController;

use App\Http\Controllers\ReserveringController;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'categories' => \App\Models\Category::withCount('tool')->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'count' => $category->tool_count . ' items',
            ];
        }),
        'featuredItems' => \App\Models\Tool::with(['category', 'price'])->take(4)->get()->map(function ($tool) {
            return [
                'id' => $tool->id,
                'name' => $tool->name,
                'category' => $tool->category->name ?? 'Algemeen',
                'price' => $tool->price->first()->dayprice ?? 0,
                'rating' => 4.8,
                'reviews' => rand(10, 200),
                'image' => $tool->images ?? 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                'available' => true,
            ];
        }),
    ]);
})->name('home');

Route::middleware(['auth', 'role:beheerder'])->prefix('admin')->group(function(){
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
    Route::get('/stats',[StatController::class,'index'])->name('stats');
    Route::get('/facturen',[FacturenController::class,'adminIndex'])->name('admin.facturen');
});

Route::middleware(['auth', 'role:klant'])->group(function () {
    Route::get('/klant/facturen', [FacturenController::class, 'index'])->name('klant.facturen');

    Route::get('/klant/producten',[ReserveringController::class,'index'])->name('reservering.index'); 
    Route::get('/klant/product/{id}', [ReserveringController::class, 'show'])->name('reservering.show');
    Route::post('/klant/reserveren', [ReserveringController::class, 'store']);

    Route::get('/klant/reserveringen', [ReserveringController::class, 'reserveringen'])->name('reservering.reserveringen');
    Route::patch('/reserveringen/{reservation}/cancel', [ReserveringController::class, 'cancel'])->name('reserveringen.cancel');
    Route::get('/klant/reserveringen/{id}', [ReserveringController::class, 'show'])->name('reservering.show_detail');
    Route::patch('/klant/reserveringen/{reservation}', [ReserveringController::class, 'update'])->name('reservering.update');
});

Route::middleware(['auth'])->get('/facturen/{invoice}/print', [FacturenController::class, 'print'])->name('invoices.print');
Route::middleware(['auth'])->get('/facturen/{invoice}/bestand', [FacturenController::class, 'file'])->name('invoices.file');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
Route::middleware(['auth', 'role:medewerker'])->prefix('medewerker')->group(function(){
    Route::get('/uitgifte-registreren',[EmployeeController::class, 'indexIssue'])->name('medewerker.uitgifte-registreren');
    Route::patch('/reservations/{reservation}',[EmployeeController::class, 'updateIssue']);
    Route::get('/verlenging-aanvragen',[EmployeeController::class, 'indexExtended'])->name('medewerker.verlenging-aanvragen');
    Route::patch('/reservations/{reservation}/extend',[EmployeeController::class, 'extendReservation']);
    Route::get('/retour-registreren',[EmployeeController::class, 'indexReturn'])->name('medewerker.retour-registreren');
    Route::patch('/retour/{reservation}',[EmployeeController::class, 'updateReturn']);
    Route::get('/onderhoud-registreren',[EmployeeController::class, 'indexMaintenance'])->name('medewerker.onderhoud-registreren');
    Route::post('/onderhoud', [EmployeeController::class, 'saveMaintenance']);
    Route::patch('/onderhoud/{maintenance}/complete',[EmployeeController::class, 'completeMaintenance']);

});

// Route::get('/', function () { return Inertia::render('Welcome'); });

// Route::get('/', function () { return Inertia::render('Welcome'); });

require __DIR__.'/settings.php';
