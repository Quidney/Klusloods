<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Reservation;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Retour>
 */
class RetourFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         // maak een reservering aan via factory
        $reservation = Reservation::factory()->create();

        // actual return ligt 0-2 dagen na returntime
        $actualReturn = (clone $reservation->returntime)->modify('+'.rand(0,2).' days');

        return [
            'reservation_id' => $reservation->id,
            'actualreturntime' => $actualReturn,
            'status' => $this->faker->randomElement(['in orde','schoonmaak nodig','schade','defect']),
            'notes' => $this->faker->optional()->sentence(6),
            'cost' => $this->faker->randomFloat(2, 0, 150),
        ];
    }
}
