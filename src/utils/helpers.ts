export const isObject = (value: any): boolean => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export const objectToFormData = (
    values: Record<string, any>,
    context?: FormData,
    namespace: string | null = null
): FormData => {
    const formData: FormData = context || new FormData()

    Object.keys(values).forEach((key: string): void => {
        const value = values[key]

        key = namespace ? `${namespace}[${key}]` : key

        if ([undefined, null].indexOf(value) > -1) {
            return
        }

        if ((isObject(value) && !(value instanceof File)) || Array.isArray(value)) {
            objectToFormData(value, formData, key)

            return
        }

        formData.append(key, value)
    })

    return formData
}