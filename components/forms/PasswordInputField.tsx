import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useColorModeValue as mode,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import * as React from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useField } from "formik";
import { InputHTMLAttributes } from "react";
import NextLink from "next/link";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  touched: boolean | undefined;
  showforgot: boolean;
  name: string;
  label: string;
};

const PasswordInputField: React.FC<InputFieldProps> = ({
  size: _,
  showforgot,
  touched,
  ...props
}) => {
  const { isOpen, onToggle } = useDisclosure();

  const [field, { error }] = useField(props);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onClickReveal = () => {
    onToggle();
    const input = inputRef.current;
    if (input) {
      input.focus({ preventScroll: true });
      const length = input.value.length * 2;
      requestAnimationFrame(() => {
        input.setSelectionRange(length, length);
      });
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <Flex justify="space-between">
        <FormLabel id={field.name} htmlFor={field.name}>
          {props.label}
        </FormLabel>
        <Box
          color={mode("teal.600", "teal.200")}
          fontWeight="semibold"
          fontSize="sm"
        >
          {showforgot && (
            <Link as={NextLink} ml={"auto"} href="/forgot-password">
              Forgot Password?
            </Link>
          )}
        </Box>
      </Flex>
      <InputGroup>
        <InputRightElement>
          <IconButton
            bg="transparent !important"
            variant="ghost"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
            icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          {...props}
          {...field}
          id={field.name}
          placeholder="password"
          type={isOpen ? "text" : "password"}
          autoComplete="current-password"
          required
        />
      </InputGroup>
      {error && touched ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default PasswordInputField;
