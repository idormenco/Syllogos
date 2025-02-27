<?php

use App\Http\Controllers\FormController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard',['searchParams'=>request()->query() ?: null]);
    })->name('dashboard');
});

Route::resource('forms',FormController::class);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
