<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'firstname' => $input['firstname'],
            'lastname' => $input['lastname'],
            'email' => $input['email'],
            'phonenumber' => $input['phonenumber'] ?? '0000000000',
            'street' => $input['street'],
            'housenumber' => $input['housenumber'],
            'postalcode' => $input['postalcode'],
            'place_of_residence' => $input['place_of_residence'],
            'role' => \App\Enums\userrole::KLANT,
            'status' => \App\Enums\userstatus::ACTIEF,
            'password' => $input['password'],
        ]);
    }
}
