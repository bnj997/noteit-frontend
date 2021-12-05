import { Box } from "@chakra-ui/layout";
import React from "react";

interface WrapperProps {
  variant?: "small" | "regular";
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <Box mx="auto" maxW={variant === "regular" ? "800px" : "500px"}>
      {children}
    </Box>
  );
};

export default Wrapper;
