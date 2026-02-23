<?php

use App\Http\Controllers\ProfileController;
use App\Models\Trade;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function (Request $request) {
    $query = Trade::query();

    if ($request->filled('date')) {
        $query->whereDate('created_at', $request->date);
    }

    $trades = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

    return Inertia::render('Welcome', [
        'trades' => $trades,
        'filters' => $request->only('date'),
    ]);
});


Route::post('/mt5/close', [Mt5Controller::class, 'close']);



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
