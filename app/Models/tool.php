<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class tool extends Model
{
    public function price() :HasOne
    {
        return $this->hasOne(price::class);
    }
    public function category()
    {
        return $this->hasOne(category::class);
    }
}
