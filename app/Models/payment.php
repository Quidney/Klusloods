<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class payment extends Model
{
    public function invoice() :BelongsTo
    {
        return $this->belongsTo(invoice::class);
    }
}
