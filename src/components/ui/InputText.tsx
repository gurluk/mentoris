import { TextInput, type TextInputProps } from "@mantine/core";
import { type FieldValues, useController } from "react-hook-form";

import { BaseInputProps } from "../types/baseInputProps.types";

type InputTextProps<T extends FieldValues> = BaseInputProps<T> & TextInputProps;

export const InputText = <T extends FieldValues>(props: InputTextProps<T>) => {
  const { name, control, rules, ...restInputProps } = props;

  const { field } = useController({
    name: name,
    control,
    rules,
  });

  return <TextInput {...field} {...restInputProps} />;
};
