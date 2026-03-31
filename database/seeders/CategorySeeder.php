<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Category::factory()->count(5)->create();

        Category::create([
        'id' => 1,
        'name' => 'Hamer',
        'description' => null,
        ]);

        Category::create([
        'id' => 2,
        'name' => 'Schroevendraaier',
        'description' => null,
        ]);

        Category::create([
        'id' => 3,
        'name' => 'Boormachine',
        'description' => null,
        ]);
    }
}
