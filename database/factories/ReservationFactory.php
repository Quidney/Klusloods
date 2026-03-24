<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Barcode;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
     public function definition(): array
    {
        // genereer een pick-up tijd in de toekomst
        $pickUp = $this->faker->dateTimeBetween('+1 days', '+10 days');
        // return tijd 1-5 dagen later
        $return = (clone $pickUp)->modify('+'.rand(1,5).' days');

        return [
            'user_id' => User::factory(),        
            'barcode_id' => Barcode::factory(),  
            'pickuptime' => $pickUp,
            'returntime' => $return,
            'status' => $this->faker->randomElement(['gereserveerd','geannuleerd']),
        ];
    }
}
