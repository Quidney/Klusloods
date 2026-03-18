<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class reservation extends Model
{
    public function retour() :HasOne
    {
        return $this->hasOne(retour::class);
    }
}
