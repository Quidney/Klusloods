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
        'id' => 1,
        'firstname' => 'steven',
        'lastname' => 'stan',
        'email' => 'stevenstan@gmail.com',
        'phonenumber' => '1234567890',
        'street' => 'almelo straat',
        'housenumber' => '123',
        'postalcode' => '59184',
        'place_of_residence' => 'almelo',
        'role' => 'klant',
        'status' => 'actief',
        'password' => '12345678'
        ]);


         User::create([
        'id' => 2,
        'firstname' => 'jan',
        'lastname' => 'pieter',
        'email' => 'janpieter@gmail.com',
        'phonenumber' => '1234567890',
        'street' => 'enschede straat',
        'housenumber' => '456', 
        'postalcode' => '12059',
        'place_of_residence' => 'enschede',
        'role' => 'medewerker',
        'status' => 'actief',
        'password' => 'medewerker'
        ]);

         User::create([
        'id' => 3,
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

        User::create([
        'id' => 4,
        'firstname' => 'anna',
        'lastname' => 'smit',
        'email' => 'anna.smit@gmail.com',
        'phonenumber' => '0987654321',
        'street' => 'dorpstraat',
        'housenumber' => '12',
        'postalcode' => '1234AB',
        'place_of_residence' => 'hengelo',
        'role' => 'klant',
        'status' => 'actief',
        'password' => 'password'
        ]);

        User::create([
        'id' => 5,
        'firstname' => 'peter',
        'lastname' => 'de vries',
        'email' => 'peter.devries@gmail.com',
        'phonenumber' => '0612345678',
        'street' => 'stationsweg',
        'housenumber' => '34',
        'postalcode' => '5678CD',
        'place_of_residence' => 'hengelo',
        'role' => 'klant',
        'status' => 'actief',
        'password' => 'password'
        ]);

        User::create([
        'id' => 6,
        'firstname' => 'lisa',
        'lastname' => 'jansen',
        'email' => 'lisa.jansen@klusloods.nl',
        'phonenumber' => '0687654321',
        'street' => 'werkstraat',
        'housenumber' => '56',
        'postalcode' => '9012EF',
        'place_of_residence' => 'hengelo',
        'role' => 'medewerker',
        'status' => 'actief',
        'password' => 'password'
        ]);
    }
}
