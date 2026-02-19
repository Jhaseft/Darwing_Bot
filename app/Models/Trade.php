<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trade extends Model
{
    protected $table = 'operaciones_mt5'; // Cambia si tu tabla tiene otro nombre

    protected $primaryKey = 'id';

    public $timestamps = false; // Solo tienes created_at, no updated_at

    protected $fillable = [
        'ticket',
        'symbol',
        'type',
        'volume',
        'price_open',
        'stop_loss',
        'take_profit',
        'magic_number',
        'comment',
        'retcode',
        'status',
    ];

    protected $casts = [
        'ticket' => 'integer',
        'volume' => 'decimal:2',
        'price_open' => 'decimal:8',
        'stop_loss' => 'decimal:8',
        'take_profit' => 'decimal:8',
        'magic_number' => 'integer',
        'retcode' => 'integer',
        'created_at' => 'datetime',
    ];
}
