<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tool extends Model
{
    public function price()
    {
        return $this->belongsTo(Price::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function barcode() :HasMany
    {
        return $this->hasMany(barcode::class);
    }
}
