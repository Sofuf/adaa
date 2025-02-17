// src/types/arabic-reshaper.d.ts

declare module 'arabic-reshaper' {
    export function convertArabic(text: string): string;
    export function convertArabicBack(text: string): string;
    export function convertNumbers(text: string): string;
    export function convertNumbersBack(text: string): string;
    export function convertPresentation(text: string): string;
    export function convertPresentationBack(text: string): string;
  }