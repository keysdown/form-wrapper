export interface LocaleMessages {
    [ruleName: string]: string
}

export interface Locale {
    name: string
    messages: LocaleMessages
}
