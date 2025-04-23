"use client";

import { theme } from "@/theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState, useEffect } from "react";

export default function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>;
}
