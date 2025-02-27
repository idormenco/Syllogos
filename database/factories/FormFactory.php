<?php

namespace Database\Factories;

use App\Enums\RatingScale;
use App\Models\DateQuestion;
use App\Models\MultipleSelectionQuestion;
use App\Models\RatingQuestion;
use App\Models\SingleSelectionQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\TranslatedString;
use App\Models\Form;
use App\Models\TextQuestion;
use App\Models\NumericQuestion;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Form>
 */
class FormFactory extends Factory
{
    protected $model = Form::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $defaultLanguage = 'EN';
        $availableLanguages = [$defaultLanguage, 'RO'];

        return [
            'code' => $this->faker->word(),
            'name' => TranslatedString::generateForLanguages($availableLanguages),
            'defaultLanguage' => $defaultLanguage,
            'availableLanguages' => $availableLanguages,
            'questions' => [
                TextQuestion::generateForLanguages($availableLanguages),
                NumericQuestion::generateForLanguages($availableLanguages),
                RatingQuestion::generateForLanguages($availableLanguages),
                DateQuestion::generateForLanguages($availableLanguages),
                SingleSelectionQuestion::generateForLanguages($availableLanguages),
                MultipleSelectionQuestion::generateForLanguages($availableLanguages),
            ],
        ];
    }
}
