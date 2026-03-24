<?php

namespace Database\Factories;

use App\Models\Tool;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Barcode>
 */
class BarcodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tool_id' => Tool::factory(),
            'barcode' => fake()->unique()->ean13(),
            'status' => fake()->randomElement(['onderhoud','verhuurd','afgeschreven','beschikbaar']),
            'notes' => fake()->sentence(6),
        ];
    }
}
