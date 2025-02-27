import { BaseQuestion } from '@/types';
import { FC } from 'react';

import {
  isDateQuestion,
  isMultipleSelectionQuestion,
  isNumberQuestion,
  isRatingQuestion,
  isSingleSelectionQuestion,
  isTextQuestion,
} from '@/guards/forms';
import PreviewDateQuestion from '@/components/form-preview/PreviewDateQuestion';
import PreviewMultiSelectQuestion from '@/components/form-preview/PreviewMultiSelectQuestion';
import PreviewNumberQuestion from '@/components/form-preview/PreviewNumberQuestion';
import PreviewRatingQuestion from '@/components/form-preview/PreviewRatingQuestion';
import PreviewSingleSelectQuestion from '@/components/form-preview/PreviewSingleSelectQuestion';
import PreviewTextQuestion from '@/components/form-preview/PreviewTextQuestion';

interface FormQuestionsPreviewProps {
  questions: BaseQuestion[] | undefined;
  languageCode: string;
  title: string;
  noContentMessage: string;
}

export const FormQuestionsPreview: FC<FormQuestionsPreviewProps> = ({
  questions,
  languageCode,
  title,
  noContentMessage,
}) => {
  if (questions?.length === 0)
    return (
      <div className='flex flex-col gap-1'>
        <p className='font-bold text-gray-700'>{title}</p>
        <p className='font-normal text-gray-900'>{noContentMessage}</p>
      </div>
    );
  return (
    <div className='flex flex-col gap-1 mt-2'>
      <p className='font-bold text-gray-700'>{`${title}: ${questions?.length}`}</p>

      {questions?.map((question) => (
        <>
          {isTextQuestion(question) && (
            <PreviewTextQuestion
              questionId={question.id}
              text={question.text[languageCode]}
              helptext={question.helptext?.[languageCode]}
              inputPlaceholder={question.inputPlaceholder?.[languageCode]}
              code={question.code}
            />
          )}

          {isNumberQuestion(question) && (
            <PreviewNumberQuestion
              questionId={question.id}
              text={question.text[languageCode]}
              helptext={question.helptext?.[languageCode]}
              inputPlaceholder={question.inputPlaceholder?.[languageCode]}
              code={question.code}
            />
          )}

          {isDateQuestion(question) && (
            <PreviewDateQuestion
              questionId={question.id}
              text={question.text[languageCode]}
              helptext={question.helptext?.[languageCode]}
              code={question.code}
            />
          )}

          {isRatingQuestion(question) && (
            <PreviewRatingQuestion
              questionId={question.id}
              text={question.text[languageCode]}
              helptext={question.helptext?.[languageCode]}
              scale={question.scale}
              upperLabel={question.upperLabel?.[languageCode]}
              lowerLabel={question.lowerLabel?.[languageCode]}
              code={question.code}
            />
          )}

          {isMultipleSelectionQuestion(question) && (
            <PreviewMultiSelectQuestion
              questionId={question.id}
              text={question.text[languageCode]}
              helptext={question.helptext?.[languageCode]}
              options={
                question.options?.map((o) => ({
                  optionId: o.id,
                  isFreeText: o.isFreeText,
                  text: o.text[languageCode],
                })) ?? []
              }
              code={question.code}
            />
          )}

          {isSingleSelectionQuestion(question) && (
            <PreviewSingleSelectQuestion
              questionId={question.id}
              text={question.text[languageCode]}
              helptext={question.helptext?.[languageCode]}
              options={
                question.options?.map((o) => ({
                  optionId: o.id,
                  isFreeText: o.isFreeText,
                  text: o.text[languageCode],
                })) ?? []
              }
              code={question.code}
            />
          )}
        </>
      ))}
    </div>
  );
};
