<?php

namespace App\Models;

use App\Enums\QuestionType;

class NumericQuestion extends BaseQuestion
{
    public array $placeholder;

    public function __construct(string $code, array $text, array $helptext, array $placeholder)
    {
        parent::__construct(QuestionType::NumericQuestion, $code, $text, $helptext);
        $this->placeholder = $placeholder;
    }

    public static function generateForLanguages(array $languages): NumericQuestion
    {
        $numericQuestion = new NumericQuestion(fake()->word(), TranslatedString::generateForLanguages($languages), TranslatedString::generateForLanguages($languages), TranslatedString::generateForLanguages($languages));
        return $numericQuestion;
    }
}
