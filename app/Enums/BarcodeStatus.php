<?php

namespace App\Enums;

enum BarcodeStatus:string
{
    case BESCHIKBAAR='beschikbaar';
    case VERHUURD='verhuurd';
    case ONDERHOUD='onderhoud';
    case AFGESCHREVEN='afgeschreven';

}
