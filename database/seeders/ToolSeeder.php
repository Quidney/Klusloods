<?php

namespace Database\Seeders;

use App\Models\Tool;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tool::factory()->count(5)->create();
        Tool::create([
        'id' => 1,
        'category_id' => 1,
        'name' => 'Hamer',
        'description' => 'sterke hamer',
        'images' => null,
        ]);

        Tool::create([
        'id' => 2,
        'category_id' => 2,
        'name' => 'Schroevendraaier',
        'description' => 'dit is een schroevendraaier',
        'images' => null,
        ]);

        Tool::create([
        'id' => 3,
        'category_id' => 3,
        'name' => 'Boormachine',
        'description' => 'werkende boormachine',
        'images' => null,
        ]);

    }
}
