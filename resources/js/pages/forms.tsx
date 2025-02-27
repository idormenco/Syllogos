import { TailwindIndicator } from '@/components/tailwind-indicator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, FormModel, PageProps, PaginatedResponse } from '@/types';
import { Head } from '@inertiajs/react';
import { FormsTable } from '@/components/forms-table/forms-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Forms',
        href: '/forms',
    },
];

export default function Forms({
    forms,
}: PageProps<{
    forms: PaginatedResponse<FormModel>;
}>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Forms" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
                    <FormsTable forms={forms.data} pageCount={forms.meta.last_page ?? 0} />
                </div>
            </div>
            <TailwindIndicator />
        </AppLayout>
    );
}
