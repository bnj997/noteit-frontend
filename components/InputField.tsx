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
  touched: boolean | undefined;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  touched,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel id={field.name} htmlFor={field.name}>
        {label}
      </FormLabel>
      <Input
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
