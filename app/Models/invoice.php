<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class invoice extends Model
{
    public function payments(): HasMany
    {
        return $this->hasMany(payment::class);
    }
}
