import { PinInput, PinInputProps } from "@mantine/core";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

type InputPinProps<T extends FieldValues> = UseControllerProps<T> &
  PinInputProps;

export default function InputPin<T extends FieldValues>(
  props: InputPinProps<T>,
) {
  const { name, control, rules, ...restInputProps } = props;

  const { field, fieldState } = useController({
    name: name,
    control,
    rules,
  });

  const isError = !!fieldState.error?.message;

  return <PinInput error={isError} {...field} {...restInputProps} />;
}
