<?php

namespace App\Enums;

enum userrole:string
{
    case KLANT = 'klant';
    case MEDEWERKER = 'medewerker';
    case BEHEERDER = 'beheerder';
}
