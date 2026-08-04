export interface Translator {
    withLanguage(language: string, fn: () => void): void;
    translate(params: any): string;
}
