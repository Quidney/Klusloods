<?php

namespace Database\Seeders;

use App\Models\Payment;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Payment::factory()->count(5)->create();

        Payment::create([
        'id' => 1,
        'invoice_id' => 1,
        'date' => now(),
        'amount' => 10,
        'method' => 'pin',
        ]);

         Payment::create([
        'id' => 2,
        'invoice_id' => 2,
        'date' => now(),
        'amount' => 5,
        'method' => 'contant',
        ]);
    }
}
