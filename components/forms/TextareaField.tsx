import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Textarea } from "@chakra-ui/textarea";

import { useField } from "formik";
import React, { TextareaHTMLAttributes } from "react";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  touched: boolean | undefined;
};

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  touched,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel id={field.name} htmlFor={field.name}>
        {label}
      </FormLabel>
      <Textarea
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error && touched ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default TextareaField;
