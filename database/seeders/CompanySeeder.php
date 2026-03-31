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
        'Kvk' => '12345678',
        'IBAN' => 'NL99 BANK 0123 4567 89',
        'address' => 'Schouwburgplein 1, 7607 AE Almelo',
        'email' => 'klusloods@gmail.com',
        'phonenumber' => '1234567890'
        ]);
    }
}
