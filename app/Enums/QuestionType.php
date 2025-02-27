<?php

namespace App\Enums;

enum QuestionType: string
{
    case TextQuestion = 'textQuestion';
    case NumericQuestion = 'numericQuestion';
    case DateQuestion = 'dateQuestion';
    case SingleSelectionQuestion = 'singleSelectionQuestion';
    case MultipleSelectionQuestion = 'multipleSelectionQuestion';
    case RatingQuestion = 'ratingQuestion';
}
