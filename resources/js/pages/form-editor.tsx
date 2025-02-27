import FormWizard from '@/components/form-editor/FormWizard';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, FormModel, PageProps } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs = (id: string): BreadcrumbItem[] => [
    {
        title: 'Form details',
        href: `/form-editor/${id}`,
    },
];

export default function FormEditor({
    form,
}: PageProps<{
    form: FormModel;
}>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(form.id)}>
            <Head title="Forms" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    {form && <FormWizard formData={form} onSaveForm={(form) => console.log(form)} />}
                </div>
            </div>
            <TailwindIndicator />
        </AppLayout>
    );
}
