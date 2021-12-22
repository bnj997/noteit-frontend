import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  refFocus?: React.LegacyRef<HTMLInputElement>;
  touched: boolean | undefined;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  touched,
  refFocus,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel id={field.name} htmlFor={field.name}>
        {label}
      </FormLabel>
      <Input
        ref={refFocus}
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error && touched ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
