<?php

namespace App\Http\Controllers;

use App\Models\Trade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class Mt5Controller extends Controller
{
    public function close(Request $request)
    {
        Log::info("📥 MT5 CLOSE endpoint hit");

        Log::info("📦 Raw body:", [
            'content' => $request->getContent()
        ]);

        Log::info("📨 Parsed request:", $request->all());

        if (!$request->ticket) {
            Log::warning("❌ Ticket missing in request");
            return response()->json(['error' => 'Ticket required'], 400);
        }

        try {
            $trade = Trade::where('ticket', $request->ticket)->first();

            if (!$trade) {
                Log::warning("⚠ Trade not found", [
                    'ticket' => $request->ticket
                ]);

                return response()->json([
                    'error' => 'Trade not found'
                ], 404);
            }

            Log::info("✅ Trade found, updating...", [
                'ticket' => $request->ticket
            ]);

            $trade->update([
                'status'       => 'closed',
                'profit'       => $request->profit,
                'price_close'  => $request->price_close,
                'close_reason' => $request->reason,
            ]);

            Log::info("🎉 Trade updated successfully", [
                'ticket' => $request->ticket,
                'profit' => $request->profit
            ]);

            return response()->json(['ok' => true]);

        } catch (\Exception $e) {

            Log::error("🔥 Error updating trade", [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Server error'
            ], 500);
        }
    }
}