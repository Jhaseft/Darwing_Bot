<?php

namespace App\Http\Controllers;

use App\Models\OpenTrade;
use App\Models\ClosedTrade;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class Mt5Controller extends Controller
{

 

public function trade(Request $request)
{
  

    $raw = $request->getContent();
   

    $data = json_decode($raw, true);

    if (!$data) {
        $data = $request->all();
    }

    if (!isset($data['action']) || !isset($data['ticket'])) {
        return response()->json(['error' => 'Invalid payload'], 400);
    }

    try {

        if ($data['action'] === 'open') {

            if (!OpenTrade::where('ticket', $data['ticket'])->exists()) {

                OpenTrade::create([
                    'ticket'      => $data['ticket'],
                    'symbol'      => $data['symbol'],
                    'type'        => $data['type'],
                    'volume'      => $data['volume'],
                    'price_open'  => $data['price_open'],
                    'stop_loss'   => $data['sl'] ?? null,
                    'take_profit' => $data['tp'] ?? null,
                    'account'     => $data['account'],
                ]);

            }

            return response()->json(['status' => 'open_saved']);
        }

        if ($data['action'] === 'close') {

            // evitar duplicados de cierre
            if (!ClosedTrade::where('ticket', $data['ticket'])->exists()) {

                $openTrade = OpenTrade::where('ticket', $data['ticket'])->first();

                ClosedTrade::create([
                    'ticket'      => $data['ticket'],
                    'symbol'      => $data['symbol'],
                    'type'        => $openTrade->type ?? $data['type'], // usar tipo original
                    'volume'      => $data['volume'],
                    'price_open'  => $openTrade->price_open ?? null,
                    'price_close' => $data['price_close'],
                    'profit'      => $data['profit'],
                    'account'     => $data['account'],
                ]);


            }

            return response()->json(['status' => 'close_saved']);
        }

        return response()->json(['error' => 'Unknown action'], 400);

    } catch (\Exception $e) {

        return response()->json(['error' => 'Server error'], 500);
    }
}

}