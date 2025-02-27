'use client';

import type { FormModel } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function getColumns(): ColumnDef<FormModel>[] {
    return [
        {
            id: 'select',
            enableSorting: false,
            enableHiding: false,
            size: 0,
        },
        {
            accessorKey: 'code',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
            cell: ({ row }) => <div className="w-20">{row.getValue('code')}</div>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({
                row: {
                    original: { name, defaultLanguage },
                },
            }) => <div className="w-20">{name[defaultLanguage]}</div>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                return (
                    <div className="flex w-[6.25rem] items-center">
                        <span className="capitalize">{row.original.status}</span>
                    </div>
                );
            },
            filterFn: (row, id, value) => {
                return Array.isArray(value) && value.includes(row.getValue(id));
            },
        },

        {
            accessorKey: 'numberOfQuestions',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Number of questions" />,
            cell: ({ row }) => {
                return (
                    <div className="flex w-[6.25rem] items-center">
                        <span className="capitalize">{row.original.questions.length}</span>
                    </div>
                );
            },
            filterFn: (row, id, value) => {
                return Array.isArray(value) && value.includes(row.getValue(id));
            },
        },

        {
            id: 'actions',
            cell: function Cell({ row }) {
                const formId = row.original.id;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-label="Open menu" variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
                                <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link className="block w-full" href={`/forms/${formId}`} as="button" prefetch>
                                        View
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link className="block w-full" href={`/forms/${formId}/edit`} as="button" prefetch>
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            size: 40,
        },
    ];
}
