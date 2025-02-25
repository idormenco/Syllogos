<?php

namespace App\Models;
class TranslatedString
{
    public static function generateForLanguages(array $languages): array
    {
        $translatedString = [];
        foreach ($languages as $language) {
            $translatedString[strtoupper($language)] = fake()->sentence();
        }

        return $translatedString;
    }
}
