
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '../ui/input';
import { EditFormType } from '@/components/form-editor/FormWizard';

export interface NumberQuestionEditorProps {
  questionIndex: number;
}

function NumberQuestionEditor({ questionIndex }: NumberQuestionEditorProps) {
  const { control } = useFormContext<EditFormType>();

  const languageCode = useWatch({
    control,
    name: `languageCode`,
  });

  return (
    <>
      <FormField
        control={control}
        name={`questions.${questionIndex}.inputPlaceholder` as const}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} value={field.value[languageCode]}
                  onChange={event => field.onChange({
                    ...field.value,
                    [languageCode]: event.target.value
                  })} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
}

export default NumberQuestionEditor;
