import { QuestionType, RatingScaleType, TranslatedString } from '@/types';
import { Bars3BottomLeftIcon, CalculatorIcon, CalendarIcon, CheckCircleIcon, ListBulletIcon, StarIcon } from '@heroicons/react/24/solid';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
    return new Intl.DateTimeFormat('en-US', {
        month: opts.month ?? 'long',
        day: opts.day ?? 'numeric',
        year: opts.year ?? 'numeric',
        ...opts,
    }).format(new Date(date));
}

export function toSentenceCase(str: string) {
    return str
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
    originalEventHandler?: (event: E) => void,
    ourEventHandler?: (event: E) => void,
    { checkForDefaultPrevented = true } = {},
) {
    return function handleEvent(event: E) {
        originalEventHandler?.(event);

        if (checkForDefaultPrevented === false || !(event as unknown as Event).defaultPrevented) {
            return ourEventHandler?.(event);
        }
    };
}

export const isNotNilOrWhitespace = (input?: string | null) => (input?.trim()?.length || 0) > 0;

export const isNilOrWhitespace = (input?: string | null) => (input?.trim()?.length || 0) === 0;

export const questionsIconMapping : Record<QuestionType, React.ElementType> = {
    [QuestionType.TextQuestionType]: Bars3BottomLeftIcon,
    [QuestionType.NumericQuestionType]: CalculatorIcon,
    [QuestionType.DateQuestionType]: CalendarIcon,
    [QuestionType.RatingQuestionType]: StarIcon,
    [QuestionType.SingleSelectionQuestion]: CheckCircleIcon,
    [QuestionType.MultipleSelectionQuestion]: ListBulletIcon,
};

/**
 * Creates a new Translated String containing all available languages
 * @param availableLanguages available translations list
 * @param languageCode language code for which to add value
 * @param value value to set for required languageCode
 * @returns new instance of @see {@link TranslatedString}
 */
export const newTranslatedString = (availableLanguages: string[], languageCode: string, value: string = ''): TranslatedString => {
    const translatedString: TranslatedString = {};
    availableLanguages.forEach((language) => {
        translatedString[language] = '';
    });

    translatedString[languageCode] = value;

    return translatedString;
};

/**
 * Creates a new Translated String containing all available languages
 * @param availableLanguages available translations list
 * @param value value to set for required languageCode
 * @returns new instance of @see {@link TranslatedString}
 */
export const emptyTranslatedString = (availableLanguages: string[], value: string = ''): TranslatedString => {
    const translatedString: TranslatedString = {};
    availableLanguages.forEach((language) => {
        translatedString[language] = value;
    });

    return translatedString;
};

export const updateTranslationString = (
    translatedString: TranslatedString | undefined,
    availableLanguages: string[],
    languageCode: string,
    value: string,
): TranslatedString => {
    if (translatedString === undefined) {
        translatedString = newTranslatedString(availableLanguages, languageCode);
    }

    translatedString[languageCode] = value;

    return translatedString;
};

/**
 * Clones translation from a language code to a language code in @see {@link TranslatedString} instance
 * @param translatedString a instance of @see {@link TranslatedString}
 * @param fromLanguageCode language code from which to borrow translation
 * @param toLanguageCode destination
 * @param defaultValue default value
 * @returns new instance of @see {@link TranslatedString}
 */
export const cloneTranslation = (
    translatedString: TranslatedString | undefined,
    fromLanguageCode: string,
    toLanguageCode: string,
    defaultValue: string = '',
): TranslatedString | undefined => {
    if (translatedString) {
        translatedString[toLanguageCode] = translatedString[fromLanguageCode] ?? defaultValue;
    }

    return translatedString;
};

/**
 * Changes language code to another in @see {@link TranslatedString} instance
 * @param translatedString a instance of @see {@link TranslatedString}
 * @param fromLanguageCode language code from which to borrow translation
 * @param toLanguageCode destination
 * @param defaultValue default value
 * @returns new instance of @see {@link TranslatedString}
 */
export const changeLanguageCode = (
    translatedString: TranslatedString | undefined,
    fromLanguageCode: string,
    toLanguageCode: string,
    defaultValue: string = '',
): TranslatedString => {
    if (translatedString === undefined) {
        return {};
    }

    const text = translatedString[fromLanguageCode];
    delete translatedString[fromLanguageCode];

    return {
        ...translatedString,
        [toLanguageCode]: text ?? defaultValue,
    };
};

/**
 * Gets translation from a translated string.
 * If translation string is undefined, or it does not contain translation for the requested language code then it will return a default value
 * @param translatedString a instance of @see {@link TranslatedString}
 * @param languageCode language code for which to get translation
 * @param value value to set for required languageCode
 * @returns translation or a default value
 */
export const getTranslationOrDefault = (translatedString: TranslatedString | undefined, languageCode: string, value: string = ''): string => {
    if (translatedString === undefined) {
        return value;
    }

    const translation = translatedString[languageCode];
    if (translation === undefined) {
        return value;
    }

    return translation;
};


/**
 * Ensures translated string contains a value for every available languages
 * @param translatedString translated string to check for correctness
 * @param availableLanguages available translations list
 * @param value value to set for required languageCode
 * @returns new instance of @see {@link TranslatedString}
 */
export const ensureTranslatedStringCorrectness = (
    translatedString: TranslatedString | null | undefined,
    availableLanguages: string[],
    value: string = ''
): TranslatedString => {
    if (translatedString === undefined || translatedString === null) return emptyTranslatedString(availableLanguages);

    availableLanguages.forEach((language) => {
        if (translatedString[language] === undefined) {
            translatedString[language] = value;
        }
    });

    return translatedString;
};


export function ratingScaleToNumber(scale: RatingScaleType): number {
    switch (scale) {
        case RatingScaleType.OneTo3: {
            return 3;
        }
        case RatingScaleType.OneTo4: {
            return 4;
        }
        case RatingScaleType.OneTo5: {
            return 5;
        }
        case RatingScaleType.OneTo6: {
            return 6;
        }
        case RatingScaleType.OneTo7: {
            return 7;
        }
        case RatingScaleType.OneTo8: {
            return 8;
        }
        case RatingScaleType.OneTo9: {
            return 9;
        }
        case RatingScaleType.OneTo10: {
            return 10;
        }
        default: {
            return 5;
        }
    }
}

