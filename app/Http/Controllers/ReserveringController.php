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

    public function show($id)
    {
        $tool = Tool::with(['category', 'barcode', 'price'])->findOrFail($id);

        $tool->stockCount = $tool->barcode->where('status', 'beschikbaar')->count();

        $price = $tool->price->sortByDesc('created_at')->last();

        $tool->detailed_price = [
            'day' => $price->dayprice ?? 0,
            'week' => $price->weekprice ?? 0,
            'deposit' => $price->deposit ?? 0,
        ];
        return Inertia::render('klant/product', [
            'tool' => $tool
        ]);
    }
}