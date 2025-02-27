import {
    DateQuestion,
    MultipleSelectionQuestion,
    NumberQuestion,
    QuestionType,
    RatingQuestion,
    RatingScaleType,
    SingleSelectionQuestion,
    TextQuestion,
    ZDisplayLogicCondition,
    ZTranslatedString,
} from '@/types';
import { z } from 'zod';

export enum FormType {
    PSI = 'PSI',
    Opening = 'Opening',
    Voting = 'Voting',
    ClosingAndCounting = 'ClosingAndCounting',
    CitizenReporting = 'CitizenReporting',
    IncidentReporting = 'IncidentReporting',
    Other = 'Other',
}


const ZBaseEditQuestionType = z.object({
    questionId: z.string(),
    defaultLanguage: z.string().trim().min(1),
    languageCode: z.string().trim().min(1),
    text: ZTranslatedString,
    helptext: ZTranslatedString,

    hasDisplayLogic: z.boolean().catch(false),
    parentQuestionId: z.string().optional(),
    condition: ZDisplayLogicCondition.optional().catch('Equals'),
    value: z.string().optional(),

    code: z.string().trim().min(1),
});

const ZEditRatingQuestionType = ZBaseEditQuestionType.extend({
    questionType: z.literal(QuestionType.RatingQuestionType),
    lowerLabel: ZTranslatedString,
    upperLabel: ZTranslatedString,
    scale: z.enum([
        RatingScaleType.OneTo3,
        RatingScaleType.OneTo4,
        RatingScaleType.OneTo5,
        RatingScaleType.OneTo6,
        RatingScaleType.OneTo7,
        RatingScaleType.OneTo8,
        RatingScaleType.OneTo9,
        RatingScaleType.OneTo10,
    ]),
});

const ZEditDateQuestionType = ZBaseEditQuestionType.extend({
    questionType: z.literal(QuestionType.DateQuestionType),
});

const ZEditNumberQuestionType = ZBaseEditQuestionType.extend({
    questionType: z.literal(QuestionType.NumericQuestionType),
    inputPlaceholder: ZTranslatedString,
});

const ZEditTextQuestionType = ZBaseEditQuestionType.extend({
    questionType: z.literal(QuestionType.TextQuestionType),
    inputPlaceholder: ZTranslatedString,
});

const ZEditSelectOptionType = z.object({
    optionId: z.string(),
    text: ZTranslatedString,
    isFlagged: z.boolean(),
    isFreeText: z.boolean(),
});

const ZEditMultipleSelectionQuestion = ZBaseEditQuestionType.extend({
    questionType: z.literal(QuestionType.MultipleSelectionQuestion),
    options: z.array(ZEditSelectOptionType).min(1),
});

const ZEditSingleSelectionQuestionType = ZBaseEditQuestionType.extend({
    questionType: z.literal(QuestionType.SingleSelectionQuestion),
    options: z.array(ZEditSelectOptionType).min(1),
});

export const ZEditQuestionType = z.discriminatedUnion('questionType', [
    ZEditTextQuestionType,
    ZEditNumberQuestionType,
    ZEditDateQuestionType,
    ZEditRatingQuestionType,
    ZEditSingleSelectionQuestionType,
    ZEditMultipleSelectionQuestion,
]);

export type EditSelectOptionType = z.infer<typeof ZEditSelectOptionType>;
export type EditMultipleSelectionQuestionType = z.infer<typeof ZEditMultipleSelectionQuestion>;
export type EditSingleSelectionQuestionType = z.infer<typeof ZEditSingleSelectionQuestionType>;
export type EditTextQuestionType = z.infer<typeof ZEditTextQuestionType>;
export type EditNumberQuestionType = z.infer<typeof ZEditNumberQuestionType>;
export type EditRatingQuestionType = z.infer<typeof ZEditRatingQuestionType>;
export type EditDateQuestionType = z.infer<typeof ZEditDateQuestionType>;

export type EditQuestionType = z.infer<typeof ZEditQuestionType>;

export const mapToQuestionRequest = (
    q: EditQuestionType
): NumberQuestion | TextQuestion | RatingQuestion | DateQuestion | SingleSelectionQuestion | MultipleSelectionQuestion => {
    if (q.questionType === QuestionType.NumericQuestionType) {
        const numberQuestion: NumberQuestion = {
            questionType: QuestionType.NumericQuestionType,
            code: q.code,
            id: q.questionId,
            text: q.text,
            helptext: q.helptext,
            inputPlaceholder: q.inputPlaceholder,
            displayLogic: q.hasDisplayLogic
                ? { condition: q.condition!, parentQuestionId: q.parentQuestionId!, value: q.value! }
                : undefined,
        };

        return numberQuestion;
    }

    if (q.questionType === QuestionType.TextQuestionType) {
        const textQuestion: TextQuestion = {
            questionType: QuestionType.TextQuestionType,
            code: q.code,
            id: q.questionId,
            text: q.text,
            helptext: q.helptext,
            inputPlaceholder: q.inputPlaceholder,
            displayLogic: q.hasDisplayLogic
                ? { condition: q.condition!, parentQuestionId: q.parentQuestionId!, value: q.value! }
                : undefined,
        };

        return textQuestion;
    }

    if (q.questionType === QuestionType.RatingQuestionType) {
        const ratingQuestion: RatingQuestion = {
            questionType: QuestionType.RatingQuestionType,
            code: q.code,
            id: q.questionId,
            text: q.text,
            helptext: q.helptext,
            scale: q.scale,
            lowerLabel: q.lowerLabel,
            upperLabel: q.upperLabel,
            displayLogic: q.hasDisplayLogic
                ? { condition: q.condition!, parentQuestionId: q.parentQuestionId!, value: q.value! }
                : undefined,
        };

        return ratingQuestion;
    }

    if (q.questionType === QuestionType.DateQuestionType) {
        const dateQuestion: DateQuestion = {
            questionType: QuestionType.DateQuestionType,
            code: q.code,
            id: q.questionId,
            text: q.text,
            helptext: q.helptext,
            displayLogic: q.hasDisplayLogic
                ? { condition: q.condition!, parentQuestionId: q.parentQuestionId!, value: q.value! }
                : undefined,
        };

        return dateQuestion;
    }

    if (q.questionType === QuestionType.SingleSelectionQuestion) {
        const singleSelectionQuestion: SingleSelectionQuestion = {
            questionType: QuestionType.SingleSelectionQuestion,
            code: q.code,
            id: q.questionId,
            text: q.text,
            helptext: q.helptext,
            options: q.options.map((o) => ({
                id: o.optionId,
                isFlagged: o.isFlagged,
                isFreeText: o.isFreeText,
                text: o.text,
            })),
            displayLogic: q.hasDisplayLogic
                ? { condition: q.condition!, parentQuestionId: q.parentQuestionId!, value: q.value! }
                : undefined,
        };

        return singleSelectionQuestion;
    }

    if (q.questionType === QuestionType.MultipleSelectionQuestion) {
        const multipleSelectionQuestion: MultipleSelectionQuestion = {
            questionType: QuestionType.MultipleSelectionQuestion,
            code: q.code,
            id: q.questionId,
            text: q.text,
            helptext: q.helptext,
            options: q.options.map((o) => ({
                id: o.optionId,
                isFlagged: o.isFlagged,
                isFreeText: o.isFreeText,
                text: o.text,
            })),
            displayLogic: q.hasDisplayLogic
                ? { condition: q.condition!, parentQuestionId: q.parentQuestionId!, value: q.value! }
                : undefined,
        };

        return multipleSelectionQuestion;
    }

    throw new Error('unknown question type');
};

