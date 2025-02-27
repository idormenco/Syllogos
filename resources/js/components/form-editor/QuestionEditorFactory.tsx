import { EditFormType } from '@/components/form-editor/FormWizard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn, isNilOrWhitespace, questionsIconMapping } from '@/lib/utils';
import { QuestionType } from '@/types';
import { useMemo } from 'react';
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

    const question = useWatch({
        control,
        name: `questions.${questionIndex}`,
    });

    const languageCode = useWatch({
        control,
        name: `languageCode`,
    });

    // **Optimize Active State Logic**
    const isOpen = activeQuestionId === question?.questionId;

    // **Derive Icon Directly**
    const QuestionIcon = questionsIconMapping[question?.questionType];

    // **Use Object Map Instead of Switch for Readability**
    const questionTypeNames: Record<QuestionType, string> = useMemo(
        () => ({
            [QuestionType.TextQuestionType]: 'Text question',
            [QuestionType.NumericQuestionType]: 'Number question',
            [QuestionType.DateQuestionType]: 'Date question',
            [QuestionType.SingleSelectionQuestion]: 'Single select question',
            [QuestionType.MultipleSelectionQuestion]: 'Multi select question',
            [QuestionType.RatingQuestionType]: 'Rating question',
        }),
        [],
    );

    // **Compute Question Text Dynamically**
    const questionText = useMemo(() => {
        return isNilOrWhitespace(question?.text?.[languageCode])
            ? questionTypeNames[question?.questionType] || 'Unknown'
            : question.text[languageCode];
    }, [question?.text, question?.questionType, languageCode, questionTypeNames]);

    // **Use Object Map for Question Editors**
    const questionEditors: Record<QuestionType, React.ElementType> = useMemo(
        () => ({
            [QuestionType.TextQuestionType]: TextQuestionEditor,
            [QuestionType.DateQuestionType]: () => <></>, // date question does not have extra things to configure
            [QuestionType.NumericQuestionType]: NumberQuestionEditor,
            [QuestionType.RatingQuestionType]: RatingQuestionEditor,
            [QuestionType.MultipleSelectionQuestion]: SelectQuestionEditor,
            [QuestionType.SingleSelectionQuestion]: SelectQuestionEditor,
        }),
        [],
    );

    const EditorComponent = questionEditors[question?.questionType];

    return (
        <div
            className={cn(
                isOpen ? 'scale-100 shadow-lg' : 'scale-97 shadow-md',
                'flex flex-row rounded-lg bg-white transition-all duration-300 ease-in-out',
            )}
        >
            {/* Left Index Panel */}
            <div
                className={cn(
                    isOpen ? 'bg-slate-600' : 'bg-purple-900',
                    'top-0 w-10 rounded-l-lg p-2 text-center text-sm text-white hover:bg-slate-600',
                    getFieldState(`questions.${questionIndex}`).invalid && 'bg-red-400 hover:bg-red-600',
                )}
            >
                {questionIndex + 1}
            </div>

            {/* Collapsible Question Panel */}
            <Collapsible
                open={isOpen}
                onOpenChange={() => setActiveQuestionId(isOpen ? undefined : question.questionId)}
                className="flex-1 rounded-r-lg border border-slate-200"
            >
                {/* Header Section */}
                <CollapsibleTrigger asChild className="flex cursor-pointer justify-between p-4 hover:bg-slate-50">
                    <div>
                        <div className="inline-flex">
                            {QuestionIcon && (
                                <div className="mr-2 -ml-0.5 min-h-5 min-w-5 text-slate-500">
                                    <QuestionIcon aria-hidden="true" />
                                </div>
                            )}
                            <p className="text-sm font-semibold break-all">{questionText}</p>
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

                {/* Collapsible Content */}
                <CollapsibleContent className="space-y-4 px-4 pb-4">
                    {/* Question Text Input */}
                    <FormField
                        control={control}
                        name={`questions.${questionIndex}.text`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question text</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value?.[languageCode]}
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

                    {/* Question Helptext Input */}
                    <FormField
                        control={control}
                        name={`questions.${questionIndex}.helptext`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question helptext</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value?.[languageCode]}
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

                    {/* Dynamically Render Question Editor */}
                    {EditorComponent && <EditorComponent questionIndex={questionIndex} />}

                    {/* Question Code Input */}
                    <FormField
                        control={control}
                        name={`questions.${questionIndex}.code`}
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

                    {/* Display Logic Editor */}
                    <DisplayLogicEditor questionIndex={questionIndex} />
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
