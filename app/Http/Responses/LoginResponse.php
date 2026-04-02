<?php

namespace App\Http\Responses;

use App\Enums\userrole;
use BackedEnum;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        /** @var Request $request */
        $user = $request->user();
        $role = $user?->role;

        if ($role instanceof BackedEnum) {
            $role = $role->value;
        }

        $target = match ($role) {
            userrole::KLANT->value => '/klant/producten',
            userrole::MEDEWERKER->value => '/medewerker/uitgifte-registreren',
            userrole::BEHEERDER->value => '/admin/category',
            default => '/dashboard',
        };

        return redirect()->intended($target);
    }
}
