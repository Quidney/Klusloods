<?php

namespace Database\Seeders;

use App\Models\Reservation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reservation::factory()->count(5)->create();

        Reservation::create([
        'id' => 1,
        'user_id' => 3,
        'barcode_id' => 2,
        'pickuptime' => now(),
        'returntime' => now()->addWeek(),
        'status' => 'gereserveerd'
        ]);
    }
}
