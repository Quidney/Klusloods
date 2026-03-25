<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Maintenance extends Model
{
    // If i don't apply it it says maintenances not found
    public $table='maintenance';
    public function barcodes() :HasMany
    {
        return $this->hasMany(Barcode::class);
    }
}
