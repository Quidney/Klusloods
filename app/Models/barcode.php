<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Barcode extends Model
{
    
    protected function casts(): array
    {
        return [
            'status'=>\App\Enums\BarcodeStatus::class
        ];
    }
    public function reservation() :HasMany
    {
        return $this->hasMany(Reservation::class);
    }
    public function tool()
    {
        return $this->belongsTo(Tool::class);
    }
    public function maintenance()
    {
        return $this->belongsTo(Maintenance::class);
    }
}
