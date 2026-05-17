import { TextInput, type TextInputProps } from "@mantine/core";
import {
  type FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

type InputTextProps<T extends FieldValues> = UseControllerProps<T> &
  TextInputProps;

export const InputText = <T extends FieldValues>(props: InputTextProps<T>) => {
  const { name, control, rules, ...restInputProps } = props;

  const { field, fieldState } = useController({
    name: name,
    control,
    rules,
  });

  return (
    <TextInput
      error={fieldState.error?.message}
      errorProps={{ hidden: false }}
      {...field}
      {...restInputProps}
    />
  );
};
