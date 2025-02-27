import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditFormType } from '@/components/form-editor/FormWizard';
import { RatingScaleType } from '@/types';

export interface RatingQuestionEditorProps {
  questionIndex: number;
}

function RatingQuestionEditor({ questionIndex }: RatingQuestionEditorProps) {
  const { control } = useFormContext<EditFormType>();

  const languageCode = useWatch({
    control,
    name: `languageCode`,
  });

  const ratingScales = useMemo(
    () => [
      { label: 'One to 3', value: RatingScaleType.OneTo3 },
      { label: 'One to 4', value: RatingScaleType.OneTo4 },
      { label: 'One to 5', value: RatingScaleType.OneTo5 },
      { label: 'One to 6', value: RatingScaleType.OneTo6 },
      { label: 'One to 7', value: RatingScaleType.OneTo7 },
      { label: 'One to 8', value: RatingScaleType.OneTo8 },
      { label: 'One to 9', value: RatingScaleType.OneTo9 },
      { label: 'One to 10', value: RatingScaleType.OneTo10 },
    ],
    []
  );

  return (
    <div className='space-y-4'>
      <FormField
        control={control}
        name={`questions.${questionIndex}.scale` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Scale</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select a rating scale' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ratingScales.map((scale) => (
                  <SelectItem value={scale.value} key={scale.value}>
                    {scale.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`questions.${questionIndex}.lowerLabel` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lower label</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value[languageCode]}
                onChange={(event) =>
                  field.onChange({
                    ...field.value,
                    [languageCode]: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`questions.${questionIndex}.upperLabel` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upper label</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value[languageCode]}
                onChange={(event) =>
                  field.onChange({
                    ...field.value,
                    [languageCode]: event.target.value,
                  })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default RatingQuestionEditor;
