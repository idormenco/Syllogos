import { LucideIcon } from 'lucide-react';
import { z } from "zod";
import type { ColumnSort, Row } from "@tanstack/react-table";

import type { DataTableConfig } from "@/config/data-table";
import type { filterSchema } from "@/lib/parsers";
export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    searchParams: Record<string, string | number | boolean>;
    auth: {
        user: User;
    };
};

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        first_page_url: string;
        from: number | null;
        last_page: number;
        last_page_url: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number | null;
        total: number;
    };
}

export interface FormDetails {
    id: string;
    code: string;
    name: TranslatedString;
    status: FormStatus;
    availableLanguages: string[];
    defaultLanguage: string;
    questions: BaseQuestion[];
}

export const ZTranslatedString = z.record(z.string());
export type TranslatedString = z.infer<typeof ZTranslatedString>;

export enum FormStatus {
    Drafted = "Drafted",
    Published = "Published",
    Obsolete = "Obsolete",
}

export enum QuestionType {
    TextQuestionType = "textQuestion",
    NumberQuestionType = "numberQuestion",
    DateQuestionType = "dateQuestion",
    SingleSelectQuestionType = "singleSelectQuestion",
    MultiSelectQuestionType = "multiSelectQuestion",
    RatingQuestionType = "ratingQuestion",
}

export interface DisplayLogic {
    parentQuestionId: string;
    condition: DisplayLogicCondition;
    value: string;
}

export interface BaseQuestion {
    id: string;
    questionType: QuestionType;
    code: string;
    text: TranslatedString;
    helptext?: TranslatedString;
    displayLogic?: DisplayLogic;
}

export interface DateQuestion extends BaseQuestion {
    questionType: QuestionType.DateQuestionType;
}

export interface TextQuestion extends BaseQuestion {
    questionType: QuestionType.TextQuestionType;
    inputPlaceholder?: TranslatedString;
}
export interface NumberQuestion extends BaseQuestion {
    questionType: QuestionType.NumberQuestionType;
    inputPlaceholder?: TranslatedString;
}

export enum RatingScaleType {
    OneTo3 = "OneTo3",
    OneTo4 = "OneTo4",
    OneTo5 = "OneTo5",
    OneTo6 = "OneTo6",
    OneTo7 = "OneTo7",
    OneTo8 = "OneTo8",
    OneTo9 = "OneTo9",
    OneTo10 = "OneTo10",
}

export interface RatingQuestion extends BaseQuestion {
    upperLabel?: TranslatedString;
    lowerLabel?: TranslatedString;
    questionType: QuestionType.RatingQuestionType;
    scale: RatingScaleType;
}

export interface SelectOption {
    id: string;
    text: TranslatedString;
    isFlagged: boolean;
    isFreeText: boolean;
}

export interface SingleSelectQuestion extends BaseQuestion {
    questionType: QuestionType.SingleSelectQuestionType;
    options: SelectOption[];
}
export interface MultiSelectQuestion extends BaseQuestion {
    questionType: QuestionType.MultiSelectQuestionType;
    options: SelectOption[];
}

export const ZDisplayLogicCondition = z.enum([
    'Equals',
    'NotEquals',
    'LessThan',
    'LessEqual',
    'GreaterThan',
    'GreaterEqual',
    'Includes',
]);

export type DisplayLogicCondition = z.infer<typeof ZDisplayLogicCondition>;

export enum AnswerType {
    TextAnswerType = "textAnswer",
    NumberAnswerType = "numberAnswer",
    DateAnswerType = "dateAnswer",
    SingleSelectAnswerType = "singleSelectAnswer",
    MultiSelectAnswerType = "multiSelectAnswer",
    RatingAnswerType = "ratingAnswer",
}

export const BaseAnswerSchema = z.object({
    $answerType: z.string(),
    questionId: z.string(),
});
export type BaseAnswer = z.infer<typeof BaseAnswerSchema>;

export const TextAnswerSchema = BaseAnswerSchema.extend({
    $answerType: z.literal(AnswerType.TextAnswerType),
    text: z.string().optional(),
});
export type TextAnswer = z.infer<typeof TextAnswerSchema>;

export const NumberAnswerSchema = BaseAnswerSchema.extend({
    $answerType: z.literal(AnswerType.NumberAnswerType),
    value: z.coerce.number().optional(),
});
export type NumberAnswer = z.infer<typeof NumberAnswerSchema>;

export const DateAnswerSchema = BaseAnswerSchema.extend({
    $answerType: z.literal(AnswerType.DateAnswerType),
    date: z.string().datetime({ offset: true }).optional(),
});
export type DateAnswer = z.infer<typeof DateAnswerSchema>;

export const RatingAnswerSchema = BaseAnswerSchema.extend({
    $answerType: z.literal(AnswerType.RatingAnswerType),
    value: z.coerce.number().optional(),
});
export type RatingAnswer = z.infer<typeof RatingAnswerSchema>;

export const SelectedOptionSchema = z.object({
    optionId: z.string().optional(),
    text: z.string().optional().nullable(),
});
export type SelectedOption = z.infer<typeof SelectedOptionSchema>;

export const SingleSelectAnswerSchema = BaseAnswerSchema.extend({
    $answerType: z.literal(AnswerType.SingleSelectAnswerType),
    selection: SelectedOptionSchema.optional(),
});
export type SingleSelectAnswer = z.infer<typeof SingleSelectAnswerSchema>;

export const MultiSelectAnswerSchema = BaseAnswerSchema.extend({
    $answerType: z.literal(AnswerType.MultiSelectAnswerType),
    selection: z.array(SelectedOptionSchema).optional(),
});
export type MultiSelectAnswer = z.infer<typeof MultiSelectAnswerSchema>;

export interface FormModel {
    id: string;
    code: string;
    defaultLanguage: string;
    name: TranslatedString;
    description: TranslatedString;
    status: FormStatus;
    availableLanguages: string[];
    questions: BaseQuestion[];
}


export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export interface Option {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    count?: number;
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
    id: StringKeyOf<TData>;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type ColumnType = DataTableConfig["columnTypes"][number];

export type FilterOperator = DataTableConfig["globalOperators"][number];

export type JoinOperator = DataTableConfig["joinOperators"][number]["value"];

export interface DataTableFilterField<TData> {
    id: StringKeyOf<TData>;
    label: string;
    placeholder?: string;
    options?: Option[];
}

export interface DataTableAdvancedFilterField<TData>
    extends DataTableFilterField<TData> {
    type: ColumnType;
}

export type Filter<TData> = Prettify<
    Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>;
}
>;

export interface DataTableRowAction<TData> {
    row: Row<TData>;
    type: "update" | "delete";
}
