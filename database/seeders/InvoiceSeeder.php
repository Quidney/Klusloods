<?php

namespace Database\Seeders;

use App\Models\Invoice;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Invoice::factory()->count(5)->create();

        Invoice::create([
        'id' => 1,
        'user_id' => 3, 
        'filepath' => '/abc', //TODO
        'paymentstatus' => 'betaald',
        ]);

        Invoice::create([
        'id' => 2,
        'user_id' => 3, 
        'filepath' => '/abc', //TODO
        'paymentstatus' => 'openstaand',
        ]);
    }
}
