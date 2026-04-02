<?php

namespace App\Http\Middleware;

use BackedEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * @param  array<int, string>  $roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $role = $user->role;

        if ($role instanceof BackedEnum) {
            $role = $role->value;
        }

        if (! in_array((string) $role, $roles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
