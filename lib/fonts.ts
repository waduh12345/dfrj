import { Fredoka, Sniglet } from "next/font/google";

export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const sniglet = Sniglet({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});