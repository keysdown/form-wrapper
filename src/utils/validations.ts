import {Rules} from '../types/rules.ts'

export const required = (
    value: string
): Promise<any> => new Promise((resolve, reject) => {
    if (value === undefined || value === null) {
        reject()
    }

    let str = String(value).replace(/\s/g, "");

    str.length > 0 ? resolve(value) : reject()
})

export const Rule: Rules = {
    required
}