import {defineRule} from '../../utils/rule'

export default defineRule('digits', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const length = Number(attributes[0])

    if (isNaN(length)) {
        return reject()
    }

    const str = String(value)

    const isDigits = /^\d+$/.test(str)

    isDigits && str.length === length ? resolve(value) : reject()
}))
