import {
  DateAnswerSchema,
  MultiSelectAnswerSchema,
  NumberAnswerSchema,
  QuestionType,
  RatingAnswerSchema,
  SingleSelectAnswerSchema,
  TextAnswerSchema,
  type BaseAnswer,
  type BaseQuestion,
  type DateAnswer,
  type MultiSelectAnswer,
  type MultipleSelectionQuestion,
  type NumberAnswer,
  type RatingAnswer,
  type RatingQuestion,
  type SingleSelectAnswer,
  type SingleSelectionQuestion,
  type TextAnswer,
  type TextQuestion,
  type NumberQuestion,
  type DateQuestion,
} from '@/types';

export function isDateAnswer(answer: BaseAnswer): answer is DateAnswer {
  return DateAnswerSchema.safeParse(answer).success;
}

export function isDateQuestion(question: BaseQuestion): question is DateQuestion {
  return question.questionType === QuestionType.DateQuestionType;
}

export function isMultiSelectAnswer(answer: BaseAnswer): answer is MultiSelectAnswer {
  return MultiSelectAnswerSchema.safeParse(answer).success;
}

export function isMultipleSelectionQuestion(question: BaseQuestion): question is MultipleSelectionQuestion {
  return question.questionType === QuestionType.MultipleSelectionQuestion;
}

export function isNumberAnswer(answer: BaseAnswer): answer is NumberAnswer {
  return NumberAnswerSchema.safeParse(answer).success;
}

export function isNumberQuestion(question: BaseQuestion): question is NumberQuestion {
  return question.questionType === QuestionType.NumericQuestionType;
}

export function isRatingAnswer(answer: BaseAnswer): answer is RatingAnswer {
  return RatingAnswerSchema.safeParse(answer).success;
}

export function isRatingQuestion(question: BaseQuestion): question is RatingQuestion {
  return question.questionType === QuestionType.RatingQuestionType;
}

export function isSingleSelectAnswer(answer: BaseAnswer): answer is SingleSelectAnswer {
  return SingleSelectAnswerSchema.safeParse(answer).success;
}

export function isSingleSelectionQuestion(question: BaseQuestion): question is SingleSelectionQuestion {
  return question.questionType === QuestionType.SingleSelectionQuestion;
}

export function isTextAnswer(answer: BaseAnswer): answer is TextAnswer {
  return TextAnswerSchema.safeParse(answer).success;
}

export function isTextQuestion(question: BaseQuestion): question is TextQuestion {
  return question.questionType === QuestionType.TextQuestionType;
}
