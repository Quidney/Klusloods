<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Company::factory()->count(1)->create();

        Company::create([
        'name' => 'Klusloods B.V.',
        'KvK' => '12345678',
        'vat_identification_number' => 'NL123456789B01',
        'vat_rate' => 21.00,
        'IBAN' => 'NL99 BANK 0123 4567 89',
        'address' => 'Schouwburgplein 1, 7607 AE Almelo',
        'email' => 'klusloods@gmail.com',
        'phonenumber' => '1234567890'
        ]);
    }
}
