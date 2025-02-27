<?php

namespace App\Models;

use App\Enums\QuestionType;
use Ramsey\Uuid\Uuid;

abstract class BaseQuestion
{
    public string $id;
    public string $code;
    public QuestionType $questionType;
    public array $text;
    public array $helptext;

    protected $casts = [
        'text' => 'array',
        'helptext' => 'array',
        'questionType' => QuestionType::class
    ];


    public function __construct(QuestionType $questionType, string $code, array $text, array $helptext)
    {
        $this->id = (string) Uuid::uuid4();
        $this->questionType = $questionType;
        $this->code = $code;
        $this->text = $text;
        $this->helptext = $helptext;
    }
}
