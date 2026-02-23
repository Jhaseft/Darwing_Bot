<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpenTrade extends Model
{
    protected $table = 'operaciones_abiertas';

    public $timestamps = false;

    protected $fillable = [
        'ticket',
        'symbol',
        'type',
        'volume',
        'price_open',
        'stop_loss',
        'take_profit',
        'account',
    ];

    protected $casts = [
        'ticket' => 'integer',
        'volume' => 'decimal:2',
        'price_open' => 'decimal:8',
        'stop_loss' => 'decimal:8',
        'take_profit' => 'decimal:8',
        'account' => 'integer',
        'opened_at' => 'datetime',
    ];
}