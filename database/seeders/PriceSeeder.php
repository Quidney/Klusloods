<?php

namespace Database\Seeders;

use App\Models\Price;
use Illuminate\Database\Seeder;

class PriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Price::factory()->count(5)->create();
        Price::create([
        'id' => 1,
        'tool_id' => 1,
        'dayprice' => 10.10,
        'weekprice' => 20.20,
        'deposit' => 10.30,
        ]);

        Price::create([
        'id' => 2,
        'tool_id' => 2,
        'dayprice' => 20.10,
        'weekprice' => 30.20,
        'deposit' => 40.30,
        ]);

        Price::create([
        'id' => 3,
        'tool_id' => 3,
        'dayprice' => 40.10,
        'weekprice' => 50.20,
        'deposit' => 60.30,
        ]);
    }
}
