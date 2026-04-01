<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class FacturenController extends Controller
{
    public function index()
    {        
        $facturen = [
            ['id' => 1, 'datum' => '12-10-2023', 'omschrijving' => 'Hamer (sterke hamer)', 'bedrag' => '€ 15,00', 'status' => 'Betaald'],
            ['id' => 2, 'datum' => '14-10-2023', 'omschrijving' => 'Schroevendraaier', 'bedrag' => '€ 8,50', 'status' => 'Openstaand'],
            ['id' => 3, 'datum' => '15-10-2023', 'omschrijving' => 'Boormachine', 'bedrag' => '€ 120,00', 'status' => 'Geannuleerd'],
        ];

        return Inertia::render('klant/facturen', [
            'facturen' => $facturen
        ]);
    }
}