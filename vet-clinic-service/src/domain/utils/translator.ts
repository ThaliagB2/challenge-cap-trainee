export interface Translator {
    translate(key: string, language: string, valuesToReaplace?: (number | string)[] | undefined): string;
}
