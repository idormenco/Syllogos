<?php

namespace App\Models;

use App\Enums\QuestionType;
use App\Enums\RatingScale;

class RatingQuestion extends BaseQuestion
{
    public array $lowerLabel;
    public array $upperLabel;
    public RatingScale $scale;

    protected $casts = [];

    public function __construct(string $code, array $text, array $helptext, array $lowerLabel, array $upperLabel, RatingScale $scale)
    {
        parent::__construct(QuestionType::RatingQuestion, $code, $text, $helptext);

        $this->casts = array_merge($this->casts, [
            'scale' => RatingScale::class
        ]);

        $this->scale = $scale;
        $this->lowerLabel = $lowerLabel;
        $this->upperLabel = $upperLabel;

    }

    public static function generateForLanguages(array $languages): RatingQuestion
    {
        $ratingQuestion = new RatingQuestion(code: fake()->word(),
            text: TranslatedString::generateForLanguages($languages),
            helptext: TranslatedString::generateForLanguages($languages),
            lowerLabel: TranslatedString::generateForLanguages($languages),
            upperLabel: TranslatedString::generateForLanguages($languages),
            scale: fake()->randomElement([RatingScale::OneTo3])
        );

        return $ratingQuestion;
    }
}
