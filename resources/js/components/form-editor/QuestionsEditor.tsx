import { v4 as uuidv4 } from 'uuid';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import AddQuestionButton from './AddQuestionButton';
import EditQuestionFactory from './QuestionEditorFactory';
import { EditFormType } from '@/components/form-editor/FormWizard';
import { EditQuestionType } from '@/types/form';

export enum MoveDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

export interface QuestionsEditorProps {
  activeQuestionId: string | undefined;
  setActiveQuestionId: (questionId: string | undefined) => void;
}

function QuestionsEditor({ activeQuestionId, setActiveQuestionId }: QuestionsEditorProps) {
  const { control, trigger } = useFormContext<EditFormType>();

  const { fields, append, swap, remove, insert } = useFieldArray({
    name: 'questions',
    control: control,
  });

  const languageCode = useWatch({
    control,
    name: `languageCode`,
  });

  const availableLanguages = useWatch({
    control,
    name: `languages`,
  });

  function addQuestion(question: EditQuestionType) {
    append(question);
    setActiveQuestionId(question.questionId);
    trigger('questions');
  }

  function duplicateQuestion(questionIndex: number) {
    const newQuestion = { ...fields[questionIndex]!, questionId: uuidv4() };
    insert(questionIndex + 1, newQuestion);
  }

  function deleteQuestion(questionIndex: number) {
    remove(questionIndex);
  }


  function moveQuestion(questionIndex: number, direction: MoveDirection) {
    swap(questionIndex, direction === MoveDirection.UP ? questionIndex - 1 : questionIndex + 1);
  }

  return (
    <div>
        <div className='grid grid-cols-1 gap-5 mb-5'>
              <div className='grid gap-5'>
                {fields.map((field, questionIndex) => (
                  <EditQuestionFactory
                    key={field.id}
                    questionIndex={questionIndex}
                    moveQuestion={moveQuestion}
                    duplicateQuestion={duplicateQuestion}
                    deleteQuestion={deleteQuestion}
                    activeQuestionId={activeQuestionId}
                    setActiveQuestionId={setActiveQuestionId}
                    isLastQuestion={questionIndex === fields.length - 1}
                  />
                ))}
              </div>
        </div>
      <AddQuestionButton
        languageCode={languageCode}
        availableLanguages={availableLanguages}
        addQuestion={addQuestion}
      />
    </div>
  );
}
export default QuestionsEditor;
