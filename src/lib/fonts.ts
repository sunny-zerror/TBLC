/*
 * Brand fonts, served from public/fonts/. Headings and display type use
 * `font-primary` (Louize Display); body and UI use `font-secondary` (Hanken Grotesk).
 */
import localFont from "next/font/local";

export const primary = localFont({
  src: [{ path: "../../public/fonts/LouizeDisplay.ttf", weight: "400", style: "normal" }],
  variable: "--ff-primary",
  display: "swap",
});

export const secondary = localFont({
  src: [
    { path: "../../public/fonts/HankenGrotesk-VariableFont_wght.ttf", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/HankenGrotesk-Italic-VariableFont_wght.ttf", weight: "100 900", style: "italic" },
  ],
  variable: "--ff-secondary",
  display: "swap",
});

export const fontVariables = `${primary.variable} ${secondary.variable}`;
