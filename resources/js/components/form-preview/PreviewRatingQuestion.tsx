import { Label } from '@/components/ui/label';
import { ratingScaleToNumber } from '@/lib/utils';
import { useFormAnswersStore } from '@/hooks/use-form-answers-store';
import { AnswerType, RatingAnswer, RatingScaleType } from '@/types';
import { useEffect, useState } from 'react';
import { RatingGroup } from '@/components/ui/ratings';

export interface PreviewRatingQuestionProps {
    questionId: string;
    text?: string;
    helptext?: string;
    scale: RatingScaleType;
    lowerLabel?: string;
    upperLabel?: string;
    code: string;
}

function PreviewRatingQuestion({ code, questionId, text, helptext, scale, lowerLabel, upperLabel }: PreviewRatingQuestionProps) {
    const { setAnswer, getAnswer } = useFormAnswersStore();
    const [localAnswer, setLocalAnswer] = useState<RatingAnswer | undefined>(undefined);

    useEffect(() => {
        const ratingAnswer = getAnswer(questionId) as RatingAnswer;
        setLocalAnswer(ratingAnswer);
    }, [getAnswer, questionId]);

    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor={`${questionId}-value`} className="font-semibold break-all">
                    {code + ' - '}
                    {text}
                </Label>
                <Label htmlFor={`${questionId}-value`} className="text-sm break-all italic">
                    {helptext}
                </Label>
                <RatingGroup
                    scale={ratingScaleToNumber(scale)}
                    id={`${questionId}-value`}
                    lowerLabel={lowerLabel}
                    upperLabel={upperLabel}
                    defaultValue={localAnswer?.value?.toString()}
                    onValueChange={(value) => {
                        const ratingAnswer: RatingAnswer = {
                            $answerType: AnswerType.RatingAnswerType,
                            questionId,
                            value: Number(value),
                        };
                        setAnswer(ratingAnswer);
                    }}
                />
            </div>
        </div>
    );
}

export default PreviewRatingQuestion;
