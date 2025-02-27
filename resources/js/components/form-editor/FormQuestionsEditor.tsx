import { EditFormType } from '@/components/form-editor/FormWizard';
import PreviewQuestion from '@/components/form-preview/PreviewQuestion';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import QuestionsEdit from './QuestionsEditor';

export default function FormQuestionsEditor() {
    const [activeQuestionId, setActiveQuestionId] = useState<string | undefined>();
    const [questionIndex, setQuestionIndex] = useState<number>(-1);
    const { control } = useFormContext<EditFormType>();

    const questions = useWatch({
        control,
        name: 'questions',
        defaultValue: [],
    });

    useEffect(() => {
        setQuestionIndex(questions.findIndex((q) => q.questionId === activeQuestionId));
    }, [questions, activeQuestionId]);

    return (
        <div className="relative z-0 flex h-[calc(100%-100px)] flex-1 gap-6 overflow-hidden">
            <main className="h-full flex-1 overflow-y-auto bg-slate-50">
                <QuestionsEdit activeQuestionId={activeQuestionId} setActiveQuestionId={setActiveQuestionId} />
            </main>
            <aside className="flex-1 items-center justify-start rounded-lg border-slate-100 md:flex md:flex-col">
                <PreviewQuestion activeQuestionId={activeQuestionId} setActiveQuestionId={setActiveQuestionId} questionIndex={questionIndex} />
            </aside>
        </div>
    );
}
