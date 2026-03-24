<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tool extends Model
{
    use HasFactory;
    public function price()
    {
        return $this->hasMany(Price::class);
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
