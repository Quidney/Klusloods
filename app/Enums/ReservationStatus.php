<?php

namespace App\Enums;

enum ReservationStatus:string
{
    case GERESERVEERD='gereserveerd';
    case GEANNULEERD='geannuleerd';
    case UITGEGEVEN='uitgegeven';
}
