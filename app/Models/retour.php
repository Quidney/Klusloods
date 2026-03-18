<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Retour extends Model
{
    public function reserveration() 
    {
        return $this->belongsTo(Reservation::class);
    }
}
