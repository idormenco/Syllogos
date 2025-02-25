<?php

namespace App\Enums;

enum FormStatus: string
{
    case Drafted = 'Drafted';
    case Published = 'Published';
    case Archived = 'Archived';
}
