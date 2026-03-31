<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Barcode;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Maintenance>
 */
class MaintenanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $barcode = Barcode::factory()->create();

        return [
            'barcode_id' => $barcode->id,
            'date' => $this->faker->dateTimeBetween('-1 month', '+1 month'),
            'description' => $this->faker->sentence(8),
            'status' => $this->faker->randomElement(['open','afgerond']),
            'cost' => $this->faker->optional()->randomFloat(2, 10, 300),
        ];
    }
}
