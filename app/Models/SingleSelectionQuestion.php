<?php

namespace App\Models;

use App\Enums\QuestionType;

class SingleSelectionQuestion extends BaseQuestion
{
    public array $placeholder;
    public array $options;

    protected $casts = [
        'options' => 'array',
    ];

    public function __construct(string $code, array $text, array $helptext, array $options)
    {
        parent::__construct(QuestionType::SingleSelectionQuestion, $code, $text, $helptext);
        $this->options = $options;
    }

    public static function generateForLanguages(array $languages): SingleSelectionQuestion
    {
        $singleSelectionQuestion = new SingleSelectionQuestion(code: fake()->word(),
            text: TranslatedString::generateForLanguages($languages),
            helptext: TranslatedString::generateForLanguages($languages),
            options: SelectOption::generateOptionsForLanguages(fake()->numberBetween(2, 4), $languages));

        return $singleSelectionQuestion;
    }
}
