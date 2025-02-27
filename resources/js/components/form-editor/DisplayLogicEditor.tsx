import { EditFormType } from '@/components/form-editor/FormWizard';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ratingScaleToNumber } from '@/lib/utils';
import { DisplayLogicCondition, QuestionType } from '@/types';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

interface DisplayLogicEditorProps {
    questionIndex: number;
}

const conditions: Record<QuestionType, DisplayLogicCondition[]> = {
    [QuestionType.DateQuestionType]: [],
    [QuestionType.TextQuestionType]: [],
    [QuestionType.MultipleSelectionQuestion]: ['Includes'],
    [QuestionType.SingleSelectionQuestion]: ['Includes'],
    [QuestionType.NumericQuestionType]: ['Equals', 'NotEquals', 'LessThan', 'LessEqual', 'GreaterThan', 'GreaterEqual'],
    [QuestionType.RatingQuestionType]: ['Equals', 'NotEquals', 'LessThan', 'LessEqual', 'GreaterThan', 'GreaterEqual'],
};

export default function DisplayLogicEditor({ questionIndex }: DisplayLogicEditorProps) {
    const { control, setValue, register, trigger } = useFormContext<EditFormType>();

    const languageCode = useWatch({ control, name: `languageCode` });

    const questions = useWatch({
        control,
        name: `questions`,
        defaultValue: [],
    });

    const parentQuestionId = useWatch({
        control,
        name: `questions.${questionIndex}.parentQuestionId`,
        defaultValue: undefined,
    });

    const question = questions[questionIndex];
    const hasDisplayLogic = question?.hasDisplayLogic || false;

    // Memoized available parent questions
    const availableParentQuestions = useMemo(
        () =>
            questions
                .slice(0, questionIndex)
                .filter((q) =>
                    [
                        QuestionType.SingleSelectionQuestion,
                        QuestionType.MultipleSelectionQuestion,
                        QuestionType.RatingQuestionType,
                        QuestionType.NumericQuestionType,
                    ].includes(q.questionType),
                ),
        [questions, questionIndex],
    );

    // Memoized parent question
    const parentQuestion = useMemo(
        () => availableParentQuestions.find((q) => q.questionId === parentQuestionId),
        [availableParentQuestions, parentQuestionId],
    );

    register(`questions.${questionIndex}.hasDisplayLogic`);
    register(`questions.${questionIndex}.parentQuestionId`);
    register(`questions.${questionIndex}.value`);
    register(`questions.${questionIndex}.condition`);

    function handleHasDisplayLogicChanged(value: boolean) {
        setValue(`questions.${questionIndex}.hasDisplayLogic`, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        if (value && availableParentQuestions.length > 0) {
            handleParentQuestionSelected(availableParentQuestions[0].questionId);
        }
        trigger(`questions.${questionIndex}`);
    }

    function handleParentQuestionSelected(questionId: string) {
        const parent = availableParentQuestions.find((q) => q.questionId === questionId);
        setValue(`questions.${questionIndex}.parentQuestionId`, questionId, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });

        if (!parent) return;

        const defaultCondition = 'Equals';
        let defaultValue: string | undefined = undefined;

        if (parent.questionType === QuestionType.RatingQuestionType) {
            defaultValue = '1';
        } else if (parent.questionType === QuestionType.NumericQuestionType) {
            defaultValue = '0';
        } else if (parent.questionType === QuestionType.MultipleSelectionQuestion || parent.questionType === QuestionType.SingleSelectionQuestion) {
            defaultValue = parent.options?.[0]?.optionId;
        }

        setValue(`questions.${questionIndex}.condition`, defaultCondition, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        if (defaultValue) {
            setValue(`questions.${questionIndex}.value`, defaultValue, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
        }
    }

    function handleConditionChanged(condition: DisplayLogicCondition) {
        setValue(`questions.${questionIndex}.condition`, condition, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    }

    function handleValueChanged(value: string) {
        setValue(`questions.${questionIndex}.value`, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    }

    return (
        <div className="mt-3">
            <div className="flex items-center space-x-2">
                <Switch
                    id="has-displayLogic"
                    onCheckedChange={handleHasDisplayLogicChanged}
                    checked={hasDisplayLogic}
                    // disabled={availableParentQuestions.length === 0}
                />
                <Label htmlFor="has-displayLogic" className="flex items-center gap-2">
                    Apply display logic to this question
                    {availableParentQuestions.length === 0 && (
                        <TooltipProvider>
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger type="button">
                                    <InformationCircleIcon width={18} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-[250px] text-sm text-slate-700">
                                        You need to have a prior question of type number question/rating question/single select/multiple select to
                                        enable display logic.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </Label>
            </div>

            <Collapsible open={hasDisplayLogic}>
                <CollapsibleContent className="mt-3 flex flex-col">
                    <span className="mb-2 text-sm">Display this question only when answer for previous question:</span>
                    <Select onValueChange={handleParentQuestionSelected} value={parentQuestion?.questionId}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select question" />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {availableParentQuestions.map((q) => (
                                <SelectItem key={q.questionId} value={q.questionId}>
                                    {q.text[languageCode]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {parentQuestion && (
                        <Select value={question?.condition} onValueChange={handleConditionChanged}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                {conditions[parentQuestion.questionType].map((condition) => (
                                    <SelectItem key={condition} value={condition}>
                                        {condition}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {parentQuestion?.questionType === QuestionType.NumericQuestionType && (
                        <Input type="number" value={question?.value} onChange={(e) => handleValueChanged(e.target.value)} placeholder="Value" />
                    )}

                    {parentQuestion?.questionType === QuestionType.RatingQuestionType && (
                        <Select value={question?.value} onValueChange={handleValueChanged}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                            <SelectContent>
                                {[...Array(ratingScaleToNumber(parentQuestion.scale)).keys()].map((value) => (
                                    <SelectItem key={value + 1} value={String(value + 1)}>
                                        {value + 1}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
