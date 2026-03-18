<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Price>
 */
class PriceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'dayprice' => $this->faker->randomFloat(2, 5, 100),   
            'weekprice' => $this->faker->randomFloat(2, 20, 500),
            'deposit' => $this->faker->randomFloat(2, 50, 1000),  
        ];
    }
}
