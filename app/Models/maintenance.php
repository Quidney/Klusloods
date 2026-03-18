<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Maintenance extends Model
{
    public function barcodes() :HasMany
    {
        return $this->hasMany(Barcode::class);
    }
}
