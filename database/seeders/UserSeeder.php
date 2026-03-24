<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User::factory()->count(6)->create();

        User::create([
        'id' => 3,
        'firstname' => 'steven',
        'lastname' => 'stan',
        'email' => 'test@gmail.com',
        'phonenumber' => '1234567890',
        'street' => 'teststraat',
        'housenumber' => '123',
        'postalcode' => '59184',
        'place_of_residence' => 'almelo',
        'role' => 'klant',
        'status' => 'actief',
        'password' => '12345678'
        ]);


         User::create([
        'id' => 4,
        'firstname' => 'jan',
        'lastname' => 'pieter',
        'email' => 'medewerker@gmail.com',
        'phonenumber' => '1234567890',
        'street' => 'mede straat',
        'housenumber' => '456', 
        'postalcode' => '12059',
        'place_of_residence' => 'enschede',
        'role' => 'medewerker',
        'status' => 'actief',
        'password' => 'medewerker'
        ]);

         User::create([
        'id' => 5,
        'firstname' => 'admin',
        'lastname' => 'admin',
        'email' => 'admin@gmail.com',
        'phonenumber' => '1234567890',
        'street' => 'admin straat',
        'housenumber' => '789',
        'postalcode' => '98584',
        'place_of_residence' => 'amsterdam',
        'role' => 'beheerder',
        'status' => 'actief',
        'password' => 'admin'
        ]);
    }
}
