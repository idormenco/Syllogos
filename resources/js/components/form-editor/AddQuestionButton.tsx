import {
  QuestionType,
  RatingScaleType
} from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn, newTranslatedString, questionsIconMapping } from '@/lib/utils';
import {
  PlusIcon
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EditSingleSelectionQuestionType, EditQuestionType, EditMultipleSelectionQuestionType } from '@/types/form';

export type QuestionTypeConfig = {
  type: QuestionType;
  label: string;
  icon: React.ElementType;
  create: (languageCode: string, availableLanguages: string[]) => EditQuestionType;
};

const questionTypes: QuestionTypeConfig[] = [
  {
    type: QuestionType.TextQuestionType,
    icon: questionsIconMapping[QuestionType.TextQuestionType],
    label: "Text question",
    create: (languageCode: string, availableLanguages: string[]) => {
      const newTextQuestion: EditQuestionType = {
        questionType: QuestionType.TextQuestionType,
        questionId: uuidv4(),
        text: newTranslatedString(availableLanguages, languageCode, ''),
        helptext: newTranslatedString(availableLanguages, languageCode, ''),
        inputPlaceholder: newTranslatedString(availableLanguages, languageCode, ''),
        hasDisplayLogic: false,
        languageCode,
        defaultLanguage: languageCode,
        code: ''
      };

      return newTextQuestion;
    },
  },
  {
    type: QuestionType.NumericQuestionType,
    icon: questionsIconMapping[QuestionType.NumericQuestionType],
    label: 'Number question',
    create: (languageCode: string, availableLanguages: string[]) => {
      const newNumberQuestion: EditQuestionType = {
        questionType: QuestionType.NumericQuestionType,
        questionId: uuidv4(),
        text: newTranslatedString(availableLanguages, languageCode, ''),
        helptext: newTranslatedString(availableLanguages, languageCode, ''),
        inputPlaceholder: newTranslatedString(availableLanguages, languageCode, ''),
        hasDisplayLogic: false,
        languageCode,
        defaultLanguage: languageCode,
        code: ''
      };

      return newNumberQuestion;
    },
  },
  {
    type: QuestionType.DateQuestionType,
    icon: questionsIconMapping[QuestionType.DateQuestionType],
    label: 'Date question',
    create: (languageCode: string, availableLanguages: string[]) => {
      const newDateQuestion: EditQuestionType = {
        questionType: QuestionType.DateQuestionType,
        questionId: uuidv4(),
        text: newTranslatedString(availableLanguages, languageCode, ''),
        helptext: newTranslatedString(availableLanguages, languageCode, ''),
        hasDisplayLogic: false,
        languageCode,
        defaultLanguage: languageCode,
        code: ''
      };

      return newDateQuestion;
    },
  },
  {
    type: QuestionType.RatingQuestionType,
    icon: questionsIconMapping[QuestionType.RatingQuestionType],
    label: 'Rating question',
    create: (languageCode: string, availableLanguages: string[]) => {
      const newRatingQuestion: EditQuestionType = {
        questionType: QuestionType.RatingQuestionType,
        questionId: uuidv4(),
        text: newTranslatedString(availableLanguages, languageCode, ''),
        helptext: newTranslatedString(availableLanguages, languageCode, ''),
        scale: RatingScaleType.OneTo3,
        hasDisplayLogic: false,
        lowerLabel: newTranslatedString(availableLanguages, languageCode, ''),
        upperLabel: newTranslatedString(availableLanguages, languageCode, ''),
        languageCode,
        defaultLanguage: languageCode,
        code: ''
      };

      return newRatingQuestion;
    },
  },
  {
    type: QuestionType.SingleSelectionQuestion,
    icon: questionsIconMapping[QuestionType.SingleSelectionQuestion],
    label: 'Single select question',
    create: (languageCode: string, availableLanguages: string[]) => {
      const newSingleSelectQuestion: EditSingleSelectionQuestionType = {
        questionType: QuestionType.SingleSelectionQuestion,
        questionId: uuidv4(),
        text: newTranslatedString(availableLanguages, languageCode, ''),
        helptext: newTranslatedString(availableLanguages, languageCode, ''),
        hasDisplayLogic: false,
        languageCode,
        defaultLanguage: languageCode,
        code: '',
        options: [
          {
            optionId: uuidv4(),
            isFlagged: false,
            isFreeText: false,
            text: newTranslatedString(availableLanguages, languageCode, 'Option 1')
          },
          {
            optionId: uuidv4(),
            isFlagged: false,
            isFreeText: false,
            text: newTranslatedString(availableLanguages, languageCode, 'Option 2')
          },
        ]
      };

      return newSingleSelectQuestion;
    },
  },
  {
    type: QuestionType.MultipleSelectionQuestion,
    icon: questionsIconMapping[QuestionType.MultipleSelectionQuestion],
    label: 'Multi select question',
    create: (languageCode: string, availableLanguages: string[]) => {
      const newMultiSelectQuestion: EditMultipleSelectionQuestionType = {
        questionType: QuestionType.MultipleSelectionQuestion,
        questionId: uuidv4(),
        text: newTranslatedString(availableLanguages, languageCode, ''),
        helptext: newTranslatedString(availableLanguages, languageCode, ''),
        languageCode,
        defaultLanguage: languageCode,
        hasDisplayLogic: false,
        code: '',
        options: [
          {
            optionId: uuidv4(),
            isFlagged: false,
            isFreeText: false,
            text: newTranslatedString(availableLanguages, languageCode, 'Option 1')
          },
          {
            optionId: uuidv4(),
            isFlagged: false,
            isFreeText: false,
            text: newTranslatedString(availableLanguages, languageCode, 'Option 2')
          }
        ]
      };

      return newMultiSelectQuestion;
    },
  },
];

interface AddQuestionButtonProps {
  languageCode: string;
  availableLanguages: string[];
  addQuestion: (question: EditQuestionType) => void;
}

export default function AddQuestionButton({ languageCode, availableLanguages, addQuestion }: AddQuestionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn(
        open ? 'scale-100 shadow-lg' : 'scale-97 shadow-md',
        'group w-full space-y-2 rounded-lg border  border-slate-300 bg-white transition-all duration-300 ease-in-out hover:scale-100 hover:cursor-pointer hover:bg-slate-50'
      )}>
      <CollapsibleTrigger asChild className='group h-full w-full'>
        <div className='inline-flex'>
          <div className='bg-purple-900 flex w-10 items-center justify-center rounded-l-lg group-aria-expanded:rounded-bl-none group-aria-expanded:rounded-br'>
            <PlusIcon className='h-6 w-6 text-white' />
          </div>
          <div className='px-4 py-3'>
            <p className='font-semibold'>Add Question</p>
            <p className='mt-1 text-sm text-slate-500'>Add a new question to your form</p>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='justify-left flex flex-col '>
        {questionTypes.map((questionType) => (
          <button
            type='button'
            key={questionType.type}
            className='mx-2 inline-flex items-center rounded p-0.5 px-4 py-2 font-medium text-slate-700 last:mb-2 hover:bg-slate-100 hover:text-slate-800'
            onClick={() => {
              addQuestion(questionType.create(languageCode, availableLanguages));
              setOpen(false);
            }}>
            <questionType.icon className='text-primary -ml-0.5 mr-2 h-5 w-5' aria-hidden='true' />
            {questionType.label}
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
