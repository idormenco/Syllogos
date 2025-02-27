import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, FormModel, PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    isDateQuestion,
    isMultipleSelectionQuestion,
    isNumberQuestion,
    isRatingQuestion, isSingleSelectionQuestion,
    isTextQuestion
} from '@/guards/forms';
import PreviewTextQuestion from '@/components/form-preview/PreviewTextQuestion';
import PreviewNumberQuestion from '@/components/form-preview/PreviewNumberQuestion';
import PreviewRatingQuestion from '@/components/form-preview/PreviewRatingQuestion';
import PreviewDateQuestion from '@/components/form-preview/PreviewDateQuestion';
import PreviewMultiSelectQuestion from '@/components/form-preview/PreviewMultiSelectQuestion';
import PreviewSingleSelectQuestion from '@/components/form-preview/PreviewSingleSelectQuestion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Form preview',
        href: '/forms',
    },
];

export default function FormEditor({
    form,
}: PageProps<{
    form: FormModel;
}>) {
    console.log(form);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Forms" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    <Tabs defaultValue="form-details">
                        <TabsList className="mb-4 grid w-[400px] grid-cols-2 bg-gray-200">
                            <TabsTrigger value="form-details">Form details</TabsTrigger>
                            <TabsTrigger value="questions">Questions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="form-details">
                            <Card className="pt-0">
                                <CardHeader className="flex-column flex gap-2">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="flex gap-1">
                                            <span className="text-xl">Form details</span>
                                        </CardTitle>
                                    </div>
                                    <Separator />
                                </CardHeader>
                                <CardContent className="mt-6 grid grid-cols-5 gap-3">
                                    <dl className="col-span-2 divide-y divide-gray-100">
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm leading-6 font-medium text-gray-900">Code</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{form.code}</dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm leading-6 font-medium text-gray-900">Name</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                {form.name[form.defaultLanguage]}
                                            </dd>
                                        </div>

                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm leading-6 font-medium text-gray-900">Default Language</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{form.defaultLanguage}</dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm leading-6 font-medium text-gray-900">Available languages</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                {form.availableLanguages.join(' ,')}
                                            </dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm leading-6 font-medium text-gray-900">Status</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{form.status}</dd>
                                        </div>
                                    </dl>
                                    <dl className="col-span-3">
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm leading-6 font-medium text-gray-900">Description</dt>
                                            <dd className="mt-1 min-h-[100px] rounded-md border border-gray-200 px-2 py-2 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                {form.description?.[form.defaultLanguage]}
                                            </dd>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="questions">
                            <Card className="pt-0">
                                <CardHeader className="flex-column flex gap-2">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="flex gap-1">
                                            <span className="text-xl">Form questions</span>
                                        </CardTitle>
                                    </div>
                                    <Separator />
                                </CardHeader>
                                <CardContent>
                                    <div className="w-1/2 flex-col space-y-6">
                                        {form.questions.map((question) => (
                                            <div key={question.id} className='w-full'>
                                                {isTextQuestion(question) && (
                                                    <PreviewTextQuestion
                                                        questionId={question.id}
                                                        text={question.text[form.defaultLanguage]}
                                                        helptext={question.helptext?.[form.defaultLanguage]}
                                                        inputPlaceholder={question.inputPlaceholder?.[form.defaultLanguage]}
                                                        code={question.code}
                                                        key={question.id}
                                                    />
                                                )}

                                                {isNumberQuestion(question) && (
                                                    <PreviewNumberQuestion
                                                        questionId={question.id}
                                                        text={question.text[form.defaultLanguage]}
                                                        helptext={question.helptext?.[form.defaultLanguage]}
                                                        inputPlaceholder={question.inputPlaceholder?.[form.defaultLanguage]}
                                                        code={question.code}
                                                        key={question.id}
                                                    />
                                                )}

                                                {isDateQuestion(question) && (
                                                    <PreviewDateQuestion
                                                        questionId={question.id}
                                                        text={question.text[form.defaultLanguage]}
                                                        helptext={question.helptext?.[form.defaultLanguage]}
                                                        code={question.code}
                                                        key={question.id}
                                                    />
                                                )}

                                                {isRatingQuestion(question) && (
                                                    <PreviewRatingQuestion
                                                        questionId={question.id}
                                                        text={question.text[form.defaultLanguage]}
                                                        helptext={question.helptext?.[form.defaultLanguage]}
                                                        scale={question.scale}
                                                        upperLabel={question.upperLabel?.[form.defaultLanguage]}
                                                        lowerLabel={question.lowerLabel?.[form.defaultLanguage]}
                                                        code={question.code}
                                                        key={question.id}
                                                    />
                                                )}

                                                {isMultipleSelectionQuestion(question) && (
                                                    <PreviewMultiSelectQuestion
                                                        questionId={question.id}
                                                        text={question.text[form.defaultLanguage]}
                                                        helptext={question.helptext?.[form.defaultLanguage]}
                                                        options={
                                                            question.options?.map((o) => ({
                                                                optionId: o.id,
                                                                isFreeText: o.isFreeText,
                                                                text: o.text[form.defaultLanguage],
                                                            })) ?? []
                                                        }
                                                        code={question.code}
                                                        key={question.id}
                                                    />
                                                )}

                                                {isSingleSelectionQuestion(question) && (
                                                    <PreviewSingleSelectQuestion
                                                        questionId={question.id}
                                                        text={question.text[form.defaultLanguage]}
                                                        helptext={question.helptext?.[form.defaultLanguage]}
                                                        options={
                                                            question.options?.map((o) => ({
                                                                optionId: o.id,
                                                                isFreeText: o.isFreeText,
                                                                text: o.text[form.defaultLanguage],
                                                            })) ?? []
                                                        }
                                                        code={question.code}
                                                        key={question.id}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <TailwindIndicator />
        </AppLayout>
    );
}
