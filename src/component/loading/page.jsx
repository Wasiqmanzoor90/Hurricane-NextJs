// src/app/loading/page.jsx
"use client";
import { Box } from "@mui/material"; 
import Image from "next/image";

export default function LoadingPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="90vh"
      width="90vw"
    >
   <Image src="/gif/loadingGif.gif" alt="Loading..." width={200} height={200} />


    </Box>
  );
}
