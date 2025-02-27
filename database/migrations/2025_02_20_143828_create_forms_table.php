<?php

use App\Enums\FormStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('forms', function (Blueprint $table): void {
            $table->ulid(column: 'id');
            $table->string(column: 'code', length: 32);
            $table->jsonb(column: 'name')->default('{}');

            $table->enum(column: 'status', allowed: array_map(callback: fn($status): string => $status->value, array: FormStatus::cases()))
                ->default(value: FormStatus::Drafted->value);

            $table->string(column: 'defaultLanguage', length: 2);
            $table->jsonb(column: 'availableLanguages')->default(value: '[]');
            $table->jsonb(column: 'questions')->default(value: '[]');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forms');
    }
};
