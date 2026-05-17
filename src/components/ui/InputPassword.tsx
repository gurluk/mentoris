import { PasswordInput, type PasswordInputProps } from "@mantine/core";
import {
  type FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

type InputPasswordProps<T extends FieldValues> = UseControllerProps<T> &
  PasswordInputProps;

const InputPassword = <T extends FieldValues>(props: InputPasswordProps<T>) => {
  const { name, control, rules, ...restInputProps } = props;

  const { field, fieldState } = useController({
    name: name,
    control,
    rules,
  });

  return (
    <PasswordInput
      error={fieldState.error?.message}
      {...field}
      {...restInputProps}
    />
  );
};

export default InputPassword;
