<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Openinghour;


class OpeninghoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $weekdays = ['maandag','dinsdag','woensdag','donderdag','vrijdag'];
        foreach ($weekdays as $day) {
            Openinghour::factory()->create([
                'day' => $day,
                'startime' => '08:00:00',
                'endtime' => '17:00:00',
                'status' => 'open',
                // 'updated_at' => now(),
                // 'created_at' => now()
            ]);
        }

        Openinghour::factory()->create([
            'day' => 'zaterdag',
            'startime' => null,
            'endtime' => null,
            'status' => 'gesloten',
            // 'updated_at' => now(),
            // 'created_at' => now()
        ]);

        Openinghour::factory()->create([
            'day' => 'zondag',
            'startime' => null,
            'endtime' => null,
            'status' => 'gesloten',
            // 'updated_at' => now(),
            // 'created_at' => now()
        ]);
    }
}
