<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    use HasFactory;
    protected $fillable = [
    'tool_id',
    'dayprice',
    'weekprice',
    'deposit'
    ];
    public function tool()
    {
        return $this->belongsTo(Tool::class);
    }
}
