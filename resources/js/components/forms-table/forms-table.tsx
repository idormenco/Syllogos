'use client';

import { DataTable } from '@/components/data-table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import type { DataTableFilterField, FormModel } from '@/types';
import { router } from '@inertiajs/react';
import * as React from 'react';

// import type {
//   getTaskPriorityCounts,
//   getTaskStatusCounts,
//   getTasks,
// } from "../_lib/queries";
// import { getPriorityIcon, getStatusIcon } from "../_lib/utils";
// import { DeleteTasksDialog } from "./delete-tasks-dialog";
// import { useFeatureFlags } from "./feature-flags-provider";
import { getColumns } from './forms-table-columns';
// import { TasksTableFloatingBar } from "./tasks-table-floating-bar";
// import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions";
// import { UpdateTaskSheet } from "./update-task-sheet";

interface TasksTableProps {
    forms: FormModel[];
    pageCount: number;
}

export function FormsTable({ forms, pageCount }: TasksTableProps) {
    const columns = React.useMemo(() => getColumns(), []);

    /**
     * This component can render either a faceted filter or a search filter based on the `options` prop.
     *
     * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
     *
     * Each `option` object has the following properties:
     * @prop {string} label - The label for the filter option.
     * @prop {string} value - The value for the filter option.
     * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
     */
    const filterFields: DataTableFilterField<FormModel>[] = [
        {
            id: 'code',
            label: 'Code',
            placeholder: 'Filter titles...',
        },
    ];

    const { table } = useDataTable({
        data: forms,
        columns,
        pageCount,
        filterFields,
        initialState: {
            sorting: [{ id: 'status', desc: true }],
            columnPinning: { right: ['actions'] },
        },
        getRowId: (originalRow) => originalRow.id,
        shallow: false,
        clearOnDefault: true,
    });

    return (
        <>
            <DataTable table={table}></DataTable>
            {/*<UpdateTaskSheet open={rowAction?.type === 'update'} onOpenChange={() => setRowAction(null)} task={rowAction?.row.original ?? null} />*/}
            {/*<DeleteTasksDialog*/}
            {/*    open={rowAction?.type === 'delete'}*/}
            {/*    onOpenChange={() => setRowAction(null)}*/}
            {/*    tasks={rowAction?.row.original ? [rowAction?.row.original] : []}*/}
            {/*    showTrigger={false}*/}
            {/*    onSuccess={() => rowAction?.row.toggleSelected(false)}*/}
            {/*/>*/}
        </>
    );
}
