<?php

namespace App\Models;

use App\Enums\QuestionType;

class DateQuestion extends BaseQuestion
{

    public function __construct(string $code, array $text, array $helptext)
    {
        parent::__construct(QuestionType::DateQuestion, $code, $text, $helptext);
    }

    public static function generateForLanguages(array $languages): DateQuestion
    {
        $dateQuestion = new DateQuestion(code: fake()->word(),
            text: TranslatedString::generateForLanguages($languages),
            helptext: TranslatedString::generateForLanguages($languages));

        return $dateQuestion;
    }
}
