<?php

namespace App\Models;

use App\Enums\QuestionType;

class TextQuestion extends BaseQuestion
{
    public array $placeholder;
    protected $casts = [
        'placeholder' => 'array',  // Automatically cast to array (or JSON)
    ];

    public function __construct(string $code, array $text, array $helptext, array $placeholder)
    {
        parent::__construct(QuestionType::TextQuestion, $code, $text, $helptext);
        $this->placeholder = $placeholder;
    }

    public static function generateForLanguages(array $languages): TextQuestion
    {
        $textQuestion = new TextQuestion(fake()->word(), TranslatedString::generateForLanguages($languages), TranslatedString::generateForLanguages($languages), TranslatedString::generateForLanguages($languages));
        return $textQuestion;
    }
}
