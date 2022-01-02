import {
  Checkbox,
  CheckboxGroup,
  CheckboxProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type CheckboxFieldProps = InputHTMLAttributes<HTMLInputElement> &
  CheckboxProps & {
    initialFilled: any[];
    checkBoxes: any[];
    label: string;
    name: string;
    touched: boolean | undefined;
  };

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  initialFilled,
  checkBoxes,
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
      <CheckboxGroup colorScheme="green" defaultValue={initialFilled}>
        <HStack spacing={5}>
          {checkBoxes.map((item) => {
            return (
              <Checkbox
                {...field}
                {...props}
                name="categories"
                value={item.id}
                key={item.id}
                placeholder={props.placeholder}
              >
                {item.id}
              </Checkbox>
            );
          })}
        </HStack>
      </CheckboxGroup>

      {error && touched ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default CheckboxField;
