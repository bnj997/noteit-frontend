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
  Link as UILink,
  FormErrorMessage,
} from "@chakra-ui/react";
import * as React from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useField } from "formik";
import { InputHTMLAttributes } from "react";
import Link from "next/link";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  touched: boolean | undefined;
  showforgot: boolean;
  name: string;
  label: string;
};

const PasswordInputField: React.FC<InputFieldProps> = ({
  size: _,
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
        <FormLabel>{props.label}</FormLabel>
        <Box
          as="a"
          color={mode("red.600", "red.200")}
          fontWeight="semibold"
          fontSize="sm"
        >
          {props.showforgot && (
            <Link href="/forgot-password" passHref>
              <UILink ml={"auto"} color="teal" mr={4}>
                Forgot Password?
              </UILink>
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
          placeholder="password"
          type={isOpen ? "text" : "password"}
          autoComplete="current-password"
          required
        />
      </InputGroup>
      {error && props.touched ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default PasswordInputField;
