<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'barcode_id',
        'pickuptime',
        'returntime',
        'status',
        'condition',
        'accessories',
    ];
    public function retour(): HasOne
    {
        return $this->hasOne(retour::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barcode()
    {
        return $this->belongsTo(Barcode::class);
    }
}
