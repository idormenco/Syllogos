<?php

namespace App\Models;

use App\Enums\FormStatus;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    /** @use HasFactory<\Database\Factories\FormFactory> */
    use HasFactory;
    use HasUlids;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'formId';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'forms';


    protected $fillable = ['code', 'status', 'name', 'defaultLanguage', 'availableLanguages', 'questions'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'questions' => 'array',
            'status' => FormStatus::class,
            'name' => 'array',
            'availableLanguages' => 'array',
        ];
    }

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['formId'];
    }
}
