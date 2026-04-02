<?php

namespace Database\Seeders;

use App\Models\Retour;
use Illuminate\Database\Seeder;

class RetourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Retour::factory()->count(5)->create();

        Retour::create([
        'id' => 1,
        'reservation_id' => 1,
        'actualreturntime' => now()->addWeek(),
        'status' => 'schoonmaak nodig',
        'notes' => null,
        'cost' => 10,
        ]);

    }
}
