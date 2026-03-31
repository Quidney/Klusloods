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
            InvoiceSeeder::class,
            MaintenanceSeeder::class,
            PaymentSeeder::class,
            ReservationSeeder::class,
            RetourSeeder::class,
            CompanySeeder::class,
            OpeninghoursSeeder::class,
        ]);
    }
}
