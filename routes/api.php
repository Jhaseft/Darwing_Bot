<?php

use App\Http\Controllers\Mt5Controller;
use Illuminate\Support\Facades\Route;

Route::post('/mt5/trade', [Mt5Controller::class, 'trade']);