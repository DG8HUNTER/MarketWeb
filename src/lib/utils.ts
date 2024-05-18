import {  ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberShort(value: number) {
  const suffixes = ["", "K", "M", "B", "T"];
  const suffixNum = Math.floor(("" + value).length / 3);
  let shortValue = parseFloat(
    (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(3)
  );

  let formattedValue = shortValue.toString();
  if (shortValue % 1 !== 0) {
    formattedValue = shortValue.toFixed(1);
  }

  return formattedValue + suffixes[suffixNum];
}
