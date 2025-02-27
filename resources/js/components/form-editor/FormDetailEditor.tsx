import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { EditFormType } from './FormWizard';

export interface FormDetailEditorProps {
    languageCode: string;
}

function FormDetailEditor({ languageCode }: FormDetailEditorProps) {
    const { control } = useFormContext<EditFormType>();

    // const handleLanguageChange = (newLanguageCode: string): void => {
    //     const formValues = getValues();
    //     setValue('name', changeLanguageCode(formValues.name, languageCode, newLanguageCode));
    //
    //     setValue('description', changeLanguageCode(formValues.description, languageCode, newLanguageCode));
    //
    //     setValue('languageCode', newLanguageCode);
    //     setValue('defaultLanguage', newLanguageCode);
    //     setValue('languages', [newLanguageCode, ...(formValues.languages ?? []).filter((l) => l !== languageCode)]);
    //
    //     formValues.questions.forEach((question, index) => {
    //         if (question.questionType === QuestionType.NumberQuestionType || question.$questionType === QuestionType.TextQuestionType) {
    //             setValue(`questions.${index}`, {
    //                 ...question,
    //                 languageCode: newLanguageCode,
    //                 text: changeLanguageCode(question.text, languageCode, newLanguageCode),
    //                 helptext: changeLanguageCode(question.helptext, languageCode, newLanguageCode),
    //                 inputPlaceholder: changeLanguageCode(question.inputPlaceholder, languageCode, newLanguageCode),
    //             });
    //         }
    //
    //         if (question.questionType === QuestionType.DateQuestionType || question.$questionType === QuestionType.RatingQuestionType) {
    //             setValue(`questions.${index}`, {
    //                 ...question,
    //                 languageCode: newLanguageCode,
    //                 text: changeLanguageCode(question.text, languageCode, newLanguageCode)!,
    //                 helptext: changeLanguageCode(question.helptext, languageCode, newLanguageCode),
    //             });
    //         }
    //
    //         if (question.questionType === QuestionType.SingleSelectQuestionType || question.$questionType === QuestionType.MultiSelectQuestionType) {
    //             setValue(`questions.${index}`, {
    //                 ...question,
    //                 languageCode: newLanguageCode,
    //                 text: changeLanguageCode(question.text, languageCode, newLanguageCode)!,
    //                 helptext: changeLanguageCode(question.helptext, languageCode, newLanguageCode),
    //                 options: question.options?.map((option) => ({
    //                     ...option,
    //                     text: changeLanguageCode(option.text, languageCode, newLanguageCode)!,
    //                 })),
    //             });
    //         }
    //
    //         trigger(`questions.${index}`);
    //     });
    //
    //     trigger('questions');
    // };

    return (
        <div className="md:inline-flex md:space-x-6">
            <div className="space-y-4 md:w-1/2">
                <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Name"
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
                    name="defaultLanguage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a verified email to display" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="EN">English</SelectItem>
                                    <SelectItem value="RO">Romanian</SelectItem>
                                    <SelectItem value="Hu">Hungarian</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="md:w-1/2">
                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    cols={100}
                                    {...field}
                                    placeholder="Description"
                                    value={field.value ? field.value[languageCode] : ''}
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
            </div>
        </div>
    );
}

export default FormDetailEditor;
