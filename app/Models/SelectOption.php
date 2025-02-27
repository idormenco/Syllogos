<?php

namespace App\Models;


use App\Enums\RatingScale;
use Ramsey\Uuid\Uuid;

class SelectOption
{
    public string $optionId;
    public array $text;
    public bool $isFreeTextOption;

    public function __construct(array $text, bool $isFreeTextOption)
    {
        $this->optionId = (string) Uuid::uuid4();
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
