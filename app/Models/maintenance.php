<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Maintenance extends Model
{
    use HasFactory;
    protected $fillable = [
    'barcode_id',
    'date',
    'description',
    'status',
    'cost',
    ];
    public function barcode() :BelongsTo
    {
        return $this->belongsTo(Barcode::class);
    }
}
