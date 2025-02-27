<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Inertia::share('app', [
            'name' => env('APP_NAME'),
            'commitHash' =>env('COMMIT_HASH', 'LOCAL'),
            'environment' => env('APP_ENV', 'production'),
        ]);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

    }
}
