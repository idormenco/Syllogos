<?php

namespace App\Models;


use App\Enums\RatingScale;

class SelectOption
{
    public array $text;
    public bool $isFreeTextOption;

    public function __construct(array $text, bool $isFreeTextOption)
    {
        $this->text = $text;
        $this->isFreeTextOption = $isFreeTextOption;
    }

    public static function generateOptionsForLanguages(int $numberOfOptions, array $languages): array
    {
        $selectOptions = [];

        for ($i = 1; $i <= $numberOfOptions; $i++) {
            $selectOptions[] = new SelectOption(TranslatedString::generateForLanguages($languages), $i == $numberOfOptions && fake()->boolean());
        }

        return $selectOptions;
    }
}
