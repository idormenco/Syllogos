import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn, isNilOrWhitespace, questionsIconMapping } from '@/lib/utils';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { EditFormType } from '@/components/form-editor/FormWizard';
import { QuestionType } from '@/types';
import { useFormContext, useWatch } from 'react-hook-form';
import DisplayLogicEditor from './DisplayLogicEditor';
import NumberQuestionEditor from './NumberQuestionEditor';
import QuestionActions from './QuestionActions';
import type { MoveDirection } from './QuestionsEditor';
import RatingQuestionEditor from './RatingQuestionEditor';
import SelectQuestionEditor from './SelectQuestionEditor';
import TextQuestionEditor from './TextQuestionEditor';

interface QuestionEditorFactoryProps {
    questionIndex: number;
    activeQuestionId: string | undefined;
    isLastQuestion: boolean;
    setActiveQuestionId: (questionId: string | undefined) => void;
    moveQuestion: (questionIndex: number, direction: MoveDirection) => void;
    duplicateQuestion: (questionIndex: number) => void;
    deleteQuestion: (questionIndex: number) => void;
}

export default function QuestionEditorFactory({
    questionIndex,
    activeQuestionId,
    isLastQuestion,
    setActiveQuestionId,
    moveQuestion,
    duplicateQuestion,
    deleteQuestion,
}: QuestionEditorFactoryProps) {
    const { control, getFieldState } = useFormContext<EditFormType>();

    function getQuestionTypeName(questionType: QuestionType): string {
        switch (questionType) {
            case QuestionType.TextQuestionType: {
                return 'Text question';
            }
            case QuestionType.NumberQuestionType: {
                return 'Number question';
            }
            case QuestionType.DateQuestionType: {
                return 'Date question';
            }
            case QuestionType.SingleSelectQuestionType: {
                return 'Single select question';
            }
            case QuestionType.MultiSelectQuestionType: {
                return 'Multi select question';
            }
            case QuestionType.RatingQuestionType: {
                return 'Rating question';
            }
            default: {
                return 'Unknown';
            }
        }
    }

    const question = useWatch({
        control,
        name: `questions.${questionIndex}`,
    });

    const languageCode = useWatch({
        control,
        name: `languageCode`,
    });

    const open = activeQuestionId === question.questionId;

    const IconComponent = questionsIconMapping[question.questionType] || null;

    return (
        <div
            className={cn(
                open ? 'scale-100 shadow-lg' : 'scale-97 shadow-md',
                'flex flex-row rounded-lg bg-white transition-all duration-300 ease-in-out',
            )}
        >
            <div
                className={cn(
                    open ? 'bg-slate-600' : 'bg-purple-900',
                    'top-0 w-10 rounded-l-lg p-2 text-center text-sm text-white hover:bg-slate-600',
                    getFieldState(`questions.${questionIndex}`).invalid && 'bg-red-400 hover:bg-red-600',
                )}
            >
                {questionIndex + 1}
            </div>
            <Collapsible
                open={open}
                onOpenChange={() => {
                    if (activeQuestionId !== question.questionId) {
                        setActiveQuestionId(question.questionId);
                    } else {
                        setActiveQuestionId(undefined);
                    }
                }}
                className="flex-1 rounded-r-lg border border-slate-200"
            >
                <CollapsibleTrigger asChild className="flex cursor-pointer justify-between p-4 hover:bg-slate-50">
                    <div>
                        <div className="inline-flex">
                            {IconComponent && (
                                <div className="mr-2 -ml-0.5 min-h-5 min-w-5 text-slate-500">
                                    <IconComponent aria-hidden="true" />
                                </div>
                            )}
                            <p className="text-sm font-semibold break-all">
                                {isNilOrWhitespace(question.text[languageCode])
                                    ? getQuestionTypeName(question.questionType)
                                    : question.text[languageCode]}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <QuestionActions
                                questionIndex={questionIndex}
                                isLastQuestion={isLastQuestion}
                                duplicateQuestion={duplicateQuestion}
                                deleteQuestion={deleteQuestion}
                                moveQuestion={moveQuestion}
                            />
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 px-4 pb-4">
                    <FormField
                        control={control}
                        name={`questions.${questionIndex}.text` as const}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question text</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value[languageCode]}
                                        onChange={(event) =>
                                            field.onChange({
                                                ...field.value,
                                                [languageCode]: event.target.value,
                                            })
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`questions.${questionIndex}.helptext` as const}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question helptext</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value[languageCode]}
                                        onChange={(event) =>
                                            field.onChange({
                                                ...field.value,
                                                [languageCode]: event.target.value,
                                            })
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {question.questionType === QuestionType.TextQuestionType && <TextQuestionEditor questionIndex={questionIndex} />}

                    {question.questionType === QuestionType.NumberQuestionType && <NumberQuestionEditor questionIndex={questionIndex} />}

                    {question.questionType === QuestionType.RatingQuestionType && <RatingQuestionEditor questionIndex={questionIndex} />}

                    {(question.questionType === QuestionType.MultiSelectQuestionType ||
                        question.questionType === QuestionType.SingleSelectQuestionType) && <SelectQuestionEditor questionIndex={questionIndex} />}

                    <FormField
                        control={control}
                        name={`questions.${questionIndex}.code` as const}
                        render={({ field }) => (
                            <FormItem className="w-48">
                                <FormLabel>Question code</FormLabel>
                                <FormControl>
                                    <Input {...field} maxLength={16} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DisplayLogicEditor questionIndex={questionIndex} />
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
