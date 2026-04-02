<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'KvK',
        'vat_identification_number',
        'vat_rate',
        'IBAN',
        'address',
        'email',
        'phonenumber',
    ];
}
