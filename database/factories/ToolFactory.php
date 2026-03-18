<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tool>
 */
class ToolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'price_id' => Price::factory(),                  
            'category_id' => Category::factory(),          
            'name' => $this->faker->words(2, true),        
            'description' => $this->faker->sentence(10),
            'images' => null,
        ];
    }
}
