<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ToolSeeder::class,
            PriceSeeder::class,
            BarcodeSeeder::class,
            MaintenanceSeeder::class,
            ReservationSeeder::class,
            InvoiceSeeder::class,
            PaymentSeeder::class,
            RetourSeeder::class,
            CompanySeeder::class,
            OpeninghoursSeeder::class,
        ]);
    }
}
