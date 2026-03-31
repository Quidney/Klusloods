<?php

namespace App\Enums;

enum userstatus:string
{
    case ACTIEF='actief';
    case GEBLOKEERD='geblokeerd';
    case BEËINDIGD='beëindigd';
}
