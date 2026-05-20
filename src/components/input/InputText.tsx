import { TextInput, TextInputProps } from "@mantine/core";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

type InputTextProps<T extends FieldValues> = UseControllerProps<T> &
  TextInputProps;

export default function InputText<T extends FieldValues>(
  props: InputTextProps<T>,
) {
  const { name, control, rules, ...restInputProps } = props;

  const { field, fieldState } = useController({
    name: name,
    control,
    rules,
  });

  return (
    <TextInput
      error={fieldState.error?.message}
      {...field}
      {...restInputProps}
    />
  );
}
