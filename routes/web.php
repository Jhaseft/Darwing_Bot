<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Mt5Controller;
use App\Models\OpenTrade;
use App\Models\ClosedTrade;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Route::get('/', function (Request $request) {
//     $query = Trade::query();

//     if ($request->filled('date')) {
//         $query->whereDate('created_at', $request->date);
//     }

//     $trades = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

//     return Inertia::render('Welcome', [
//         'trades' => $trades,
//         'filters' => $request->only('date'),
//     ]);
// });



Route::get('/', function (Request $request) {
    $openTrades = OpenTrade::orderByDesc('id')->paginate(15)->withQueryString();

    return Inertia::render('OpenTrades', [
        'openTrades' => $openTrades,
    ]);
});

Route::get('/operaciones/{ticket}/detail', function ($ticket) {
    $open   = OpenTrade::where('ticket', $ticket)->first();
    $closed = ClosedTrade::where('ticket', $ticket)->first();

    return response()->json([
        'open'   => $open,
        'closed' => $closed,
    ]);
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
