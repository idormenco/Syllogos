<?php

namespace App\Enums;

enum QuestionType: string
{
    case TextQuestion = 'TextQuestion';
    case NumericQuestion = 'NumericQuestion';
    case DateQuestion = 'DateQuestion';
    case SingleSelectionQuestion = 'SingleSelectionQuestion';
    case MultipleSelectionQuestion = 'MultipleSelectionQuestion';
    case RatingQuestion = 'RatingQuestion';
}
