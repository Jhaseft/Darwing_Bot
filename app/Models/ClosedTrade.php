<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClosedTrade extends Model
{
    protected $table = 'operaciones_cerradas';

    public $timestamps = false;

    protected $fillable = [
        'ticket',
        'symbol',
        'type',
        'volume',
        'price_open',
        'price_close',
        'profit',
        'account',
    ];

    protected $casts = [
        'ticket' => 'integer',
        'volume' => 'decimal:2',
        'price_open' => 'decimal:8',
        'price_close' => 'decimal:8',
        'profit' => 'decimal:2',
        'account' => 'integer',
        'closed_at' => 'datetime',
    ];

    // Helper útil
    public function getResultAttribute()
    {
        return $this->profit >= 0 ? 'win' : 'loss';
    }
}