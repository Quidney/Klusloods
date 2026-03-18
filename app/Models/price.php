<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    public function tool()
    {
        return $this->hasOne(Tool::class);
    }
}
