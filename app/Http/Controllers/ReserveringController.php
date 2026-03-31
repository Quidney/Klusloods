<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Inertia\Inertia;

class ReserveringController extends Controller
{
public function index()
{
    $tools = Tool::with(['price', 'barcode', 'category'])->get();

    return Inertia::render('klant/producten', [
        'tools' => $tools
    ]);
}
}