<?php

namespace Database\Seeders;

use App\Models\Barcode;
use Illuminate\Database\Seeder;

class BarcodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Barcode::factory()->count(5)->create();

        Barcode::create([
        'id' => 1,
        'tool_id' => 1,
        'barcode' => '186598760916',
        'status' => 'beschikbaar',
        'notes' => '',
        ]);

         Barcode::create([
        'id' => 2,
        'tool_id' => 2,
        'barcode' => '372048976297',
        'status' => 'verhuurd',
        'notes' => '',
        ]);

         Barcode::create([
        'id' => 3,
        'tool_id' => 3,
        'barcode' => '282037596842',
        'status' => 'onderhoud',
        'notes' => '',
        ]);
    }
}
