<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'invoice_date',
        'user_id',
        'reservation_id',
        'filepath',
        'paymentstatus',
    ];

    protected $casts = [
        'invoice_date' => 'date',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTotalPaidAttribute()
    {
        return $this->payments->sum('amount');
    }

    public function getCalculatedStatusAttribute()
    {
        $total = $this->total_amount ?? 0; // moet je zelf nog hebben

        if ($this->total_paid == 0) {
            return 'openstaand';
        }

        if ($this->total_paid < $total) {
            return 'deels betaald';
        }

        return 'betaald';
    }
}
