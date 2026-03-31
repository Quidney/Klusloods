<?php

namespace Database\Seeders;

use App\Models\Maintenance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaintenanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Maintenance::factory()->count(5)->create();

        Maintenance::create([
        'id' => 1,
        'barcode_id' => 1,
        'date' => now(),
        'description' => 'kapotte onderdeel',
        'status' => 'open',
        'cost' => 10
        ]);

        Maintenance::create([
        'id' => 2,
        'barcode_id' => 2, 
        'date' => now(),
        'description' => 'onderdeel mist',
        'status' => 'open',
        'cost' => 20
        ]);
    }
}
