<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'KvK' => fake()->unique()->numerify('###########'),
            'IBAN' => fake()->iban(),                          
            'address' => fake()->address(),                    
            'email' => fake()->unique()->safeEmail(),        
            'phonenumber' => fake()->numerify('##########'),  
        ];
    }
}
