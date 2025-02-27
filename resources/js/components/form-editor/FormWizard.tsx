import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { cn, ensureTranslatedStringCorrectness, isNilOrWhitespace, isNotNilOrWhitespace } from '@/lib/utils';
import { FC, useEffect, useState } from 'react';

import FormQuestionsEditor from '@/components/form-editor/FormQuestionsEditor';
import { Button } from '@/components/ui/button';
import { isDateQuestion, isMultipleSelectionQuestion, isNumberQuestion, isRatingQuestion, isSingleSelectionQuestion, isTextQuestion } from '@/guards/forms';
import { FormModel, QuestionType, ZTranslatedString } from '@/types';
import {
    EditDateQuestionType,
    EditMultipleSelectionQuestionType,
    EditNumberQuestionType,
    EditRatingQuestionType,
    EditSingleSelectionQuestionType,
    EditTextQuestionType,
    FormType,
    ZEditQuestionType,
} from '@/types/form';
import EditFormDetails from './FormDetailEditor';
import { router } from '@inertiajs/react';

export const ZEditFormType = z
    .object({
        languageCode: z.string().trim().min(1, 'Language code is required.'),
        defaultLanguage: z.string().trim().min(1, 'Default language is required.'),
        code: z.string().trim().min(1, 'Code is required.'),
        name: ZTranslatedString,
        description: ZTranslatedString.optional(),
        languages: z.array(z.string()).nonempty('At least one language is required.'),
        formType: z.nativeEnum(FormType).catch(FormType.Opening),
        questions: z.array(ZEditQuestionType),
    })
    .superRefine((data, ctx) => {
        if (isNilOrWhitespace(data.name[data.languageCode])) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Form name is required',
                path: ['name'],
            });
        }

        if (isNotNilOrWhitespace(data.description?.[data.defaultLanguage]) && isNilOrWhitespace(data.description?.[data.languageCode])) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Form description is required',
                path: ['description'],
            });
        }

        data.questions.forEach((question, index) => {
            if (isNilOrWhitespace(question.text[question.languageCode])) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Question text is required',
                    path: ['questions', index, 'text'],
                });
            }

            if (isNotNilOrWhitespace(question.helptext[question.defaultLanguage]) && isNilOrWhitespace(question.helptext[question.languageCode])) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Question helptext is required',
                    path: ['questions', index, 'helptext'],
                });
            }

            if (question.questionType === QuestionType.NumericQuestionType || question.questionType === QuestionType.TextQuestionType) {
                if (
                    isNotNilOrWhitespace(question.inputPlaceholder[question.defaultLanguage]) &&
                    isNilOrWhitespace(question.inputPlaceholder[question.languageCode])
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Input placeholder is required',
                        path: ['questions', index, 'inputPlaceholder'],
                    });
                }
            }

            if (question.questionType === QuestionType.RatingQuestionType) {
                if (
                    isNotNilOrWhitespace(question.lowerLabel[question.defaultLanguage]) &&
                    isNilOrWhitespace(question.lowerLabel[question.languageCode])
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Question lower label is required',
                        path: ['questions', index, 'lowerLabel'],
                    });
                }

                if (
                    isNotNilOrWhitespace(question.upperLabel[question.defaultLanguage]) &&
                    isNilOrWhitespace(question.upperLabel[question.languageCode])
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Question upper label is required',
                        path: ['questions', index, 'upperLabel'],
                    });
                }
            }

            if (question.questionType === QuestionType.SingleSelectionQuestion || question.questionType === QuestionType.MultipleSelectionQuestion) {
                question.options.forEach((option, optionIndex) => {
                    if (isNilOrWhitespace(option.text[question.languageCode])) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Option text is required',
                            path: ['questions', index, 'options', optionIndex, 'text'],
                        });
                    }
                });

                // check uniqueness of options
                const optionTexts = question.options.map((o) => o.text[question.languageCode]);
                const textCountMap = new Map<string | undefined, number>();
                const duplicatedIndexesMap = new Map<string | undefined, number>();

                // Step 1: Count occurrences of each option
                optionTexts.forEach((text, optionIndex) => {
                    const numberOfOccurrences = (textCountMap.get(text) || 0) + 1;
                    if (numberOfOccurrences > 1) {
                        duplicatedIndexesMap.set(text, optionIndex);
                    }
                    textCountMap.set(text, numberOfOccurrences);
                });

                // Step 2: Mark duplicated options as invalid
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (const [_, optionIndex] of duplicatedIndexesMap.entries()) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Option text is not unique',
                        path: ['questions', index, 'options', optionIndex, 'text'],
                    });
                }
            }

            if (question.hasDisplayLogic) {
                if (question.condition === undefined) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Question condition is required',
                        path: ['questions', index, 'condition'],
                    });
                }

                if (question.parentQuestionId === undefined) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Question parent question is required',
                        path: ['questions', index, 'parentQuestionId'],
                    });
                }

                if (question.value === undefined) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Question value is required',
                        path: ['questions', index, 'value'],
                    });
                }
            }
        });
    });

export type EditFormType = z.infer<typeof ZEditFormType>;

interface FormEditorProps {
    formData: FormModel;
}

const FormWizard: FC<FormEditorProps> = ({ formData }) => {
    const [navigateAwayAfterSave, setNavigateAwayAfterSave] = useState(false);

    const editQuestions = formData.questions.map((question) => {
        if (isNumberQuestion(question)) {
            const numberQuestion: EditNumberQuestionType = {
                questionType: QuestionType.NumericQuestionType,
                questionId: question.id,
                text: ensureTranslatedStringCorrectness(question.text, formData.availableLanguages),
                helptext: ensureTranslatedStringCorrectness(question.helptext, formData.availableLanguages),
                inputPlaceholder: ensureTranslatedStringCorrectness(question.inputPlaceholder, formData.availableLanguages),

                hasDisplayLogic: !!question.displayLogic,

                parentQuestionId: question.displayLogic?.parentQuestionId,
                condition: question.displayLogic?.condition,
                value: question.displayLogic?.value,

                code: question.code,
                languageCode: formData.defaultLanguage,
                defaultLanguage: formData.defaultLanguage,
            };

            return numberQuestion;
        }
        if (isTextQuestion(question)) {
            const textQuestion: EditTextQuestionType = {
                questionType: QuestionType.TextQuestionType,
                questionId: question.id,
                text: ensureTranslatedStringCorrectness(question.text, formData.availableLanguages),
                helptext: ensureTranslatedStringCorrectness(question.helptext, formData.availableLanguages),
                inputPlaceholder: ensureTranslatedStringCorrectness(question.inputPlaceholder, formData.availableLanguages),

                hasDisplayLogic: !!question.displayLogic,

                parentQuestionId: question.displayLogic?.parentQuestionId,
                condition: question.displayLogic?.condition,
                value: question.displayLogic?.value,

                code: question.code,
                languageCode: formData.defaultLanguage,
                defaultLanguage: formData.defaultLanguage,
            };

            return textQuestion;
        }

        if (isDateQuestion(question)) {
            const dateQuestion: EditDateQuestionType = {
                questionType: QuestionType.DateQuestionType,
                questionId: question.id,
                text: ensureTranslatedStringCorrectness(question.text, formData.availableLanguages),
                helptext: ensureTranslatedStringCorrectness(question.helptext, formData.availableLanguages),

                hasDisplayLogic: !!question.displayLogic,

                parentQuestionId: question.displayLogic?.parentQuestionId,
                condition: question.displayLogic?.condition,
                value: question.displayLogic?.value,

                code: question.code,
                languageCode: formData.defaultLanguage,
                defaultLanguage: formData.defaultLanguage,
            };

            return dateQuestion;
        }

        if (isRatingQuestion(question)) {
            const ratingQuestion: EditRatingQuestionType = {
                questionType: QuestionType.RatingQuestionType,
                questionId: question.id,
                text: ensureTranslatedStringCorrectness(question.text, formData.availableLanguages),
                helptext: ensureTranslatedStringCorrectness(question.helptext, formData.availableLanguages),
                scale: question.scale,
                hasDisplayLogic: !!question.displayLogic,

                parentQuestionId: question.displayLogic?.parentQuestionId,
                condition: question.displayLogic?.condition,
                value: question.displayLogic?.value,

                code: question.code,
                languageCode: formData.defaultLanguage,
                defaultLanguage: formData.defaultLanguage,
                lowerLabel: ensureTranslatedStringCorrectness(question.lowerLabel, formData.availableLanguages),
                upperLabel: ensureTranslatedStringCorrectness(question.upperLabel, formData.availableLanguages),
            };

            return ratingQuestion;
        }

        if (isSingleSelectionQuestion(question)) {
            const singleSelectQuestion: EditSingleSelectionQuestionType = {
                questionType: QuestionType.SingleSelectionQuestion,
                questionId: question.id,
                text: ensureTranslatedStringCorrectness(question.text, formData.availableLanguages),
                helptext: ensureTranslatedStringCorrectness(question.helptext, formData.availableLanguages),
                options:
                    question.options?.map((o) => ({
                        optionId: o.id,
                        isFlagged: o.isFlagged,
                        isFreeText: o.isFreeText,
                        text: ensureTranslatedStringCorrectness(o.text, formData.availableLanguages),
                    })) ?? [],

                hasDisplayLogic: !!question.displayLogic,

                parentQuestionId: question.displayLogic?.parentQuestionId,
                condition: question.displayLogic?.condition,
                value: question.displayLogic?.value,

                code: question.code,
                languageCode: formData.defaultLanguage,
                defaultLanguage: formData.defaultLanguage,
            };

            return singleSelectQuestion;
        }

        if (isMultipleSelectionQuestion(question)) {
            const multiSelectQuestion: EditMultipleSelectionQuestionType = {
                questionType: QuestionType.MultipleSelectionQuestion,
                questionId: question.id,
                text: ensureTranslatedStringCorrectness(question.text, formData.availableLanguages),
                helptext: ensureTranslatedStringCorrectness(question.helptext, formData.availableLanguages),
                options:
                    question.options?.map((o) => ({
                        optionId: o.id,
                        isFlagged: o.isFlagged,
                        isFreeText: o.isFreeText,
                        text: ensureTranslatedStringCorrectness(o.text, formData.availableLanguages),
                    })) ?? [],

                hasDisplayLogic: !!question.displayLogic,

                parentQuestionId: question.displayLogic?.parentQuestionId,
                condition: question.displayLogic?.condition,
                value: question.displayLogic?.value,

                code: question.code,
                languageCode: formData.defaultLanguage,
                defaultLanguage: formData.defaultLanguage,
            };

            return multiSelectQuestion;
        }

        return undefined;
    });

    const form = useForm<EditFormType>({
        resolver: zodResolver(ZEditFormType),
        defaultValues: {
            code: formData?.code ?? '',
            languageCode: formData?.defaultLanguage ?? 'EN',
            defaultLanguage: formData?.defaultLanguage ?? 'EN',
            languages: formData?.availableLanguages ?? ['EN'],
            name: ensureTranslatedStringCorrectness(formData?.name, formData?.availableLanguages ?? ['EN']),
            description: ensureTranslatedStringCorrectness(formData?.description, formData?.availableLanguages ?? ['EN']),
            questions: editQuestions ?? [],
        },
        mode: 'all',
    });

    const languageCode = useWatch({
        control: form.control,
        name: 'languageCode',
        defaultValue: formData?.defaultLanguage,
    });

    useEffect(() => {
        if (form.formState.isSubmitSuccessful) {
            form.reset({}, { keepValues: true });
        }
    }, [form, form.formState.isSubmitSuccessful, form.reset]);

    async function onSubmit(data: EditFormType, navigateAwayAfterSave: boolean) {
        console.log(navigateAwayAfterSave);
        router.put(`/forms/${formData.id}`, data, {
            onSuccess: ()=>{
                router.visit('/forms');
            },
            onError: (errors) => {
                // Map Inertia validation errors to RHF
                console.log(errors)
                Object.entries(errors).forEach(([key, message]) => {
                    form.setError(key as keyof EditFormType, { type: 'manual', message });
                });
            },
        });
    }

    return (
        <div className="p-2">
            <Form {...form}>
                <form className="flex flex-1 flex-col" onSubmit={form.handleSubmit((data) => onSubmit(data, navigateAwayAfterSave))}>
                    <Tabs className="flex flex-1 flex-col" defaultValue="form-details">
                        <TabsList className="mb-4 grid w-[400px] grid-cols-2 bg-gray-200">
                            <TabsTrigger
                                value="form-details"
                                className={cn({
                                    'border-b-4 border-red-400': form.getFieldState('name').invalid || form.getFieldState('code').invalid,
                                })}
                            >
                                Form details
                            </TabsTrigger>
                            <TabsTrigger value="questions" className={cn({ 'border-b-4 border-red-400': form.getFieldState('questions').invalid })}>
                                Questions
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="form-details">
                            <Card className="pt-0">
                                <CardHeader className="flex-column flex gap-2">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xl">Form details</CardTitle>
                                    </div>
                                    <Separator />
                                </CardHeader>
                                <CardContent className="flex flex-col items-baseline gap-6">
                                    <EditFormDetails languageCode={languageCode} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent className="flex flex-1 flex-col" value="questions">
                            <Card className="h-[calc(100vh)] overflow-hidden pt-0">
                                <CardHeader className="flex-column flex gap-2">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xl">{languageCode && <span> {languageCode} </span>}</CardTitle>
                                    </div>
                                    <Separator />
                                </CardHeader>
                                <CardContent className="justify-left -mx-6 flex h-[100%] items-start px-6 sm:mx-0 sm:px-8">
                                    <FormQuestionsEditor />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    <footer className="fixed bottom-0 left-0 h-[64px] w-full bg-white">
                        <div className="container flex h-full items-center justify-end gap-4">
                            <Button type="submit" variant="outline" onClick={() => setNavigateAwayAfterSave(false)}>
                                Save
                            </Button>
                            <Button type="submit" variant="default" onClick={() => setNavigateAwayAfterSave(true)}>
                                Save and exit form editor
                            </Button>
                        </div>
                    </footer>
                </form>
            </Form>
        </div>
    );
};

export default FormWizard;
