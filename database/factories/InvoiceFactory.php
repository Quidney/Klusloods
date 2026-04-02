<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Reservation;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_number' => 'INV-'.$this->faker->unique()->numerify('########'),
            'invoice_date' => now()->toDateString(),
            'user_id' => User::factory(), 
            'reservation_id' => Reservation::factory(),
            'filepath' => fake()->filePath(), 
            'paymentstatus' => fake()->randomElement(['betaald','deels betaald','openstaand']),
        ];
    }
}
