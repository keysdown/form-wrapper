import {defineRule} from '../../utils/rule'

export default defineRule('digitsBetween', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const min = Number(attributes[0])
    const max = Number(attributes[1])

    if (isNaN(min) || isNaN(max)) {
        return reject()
    }

    const str = String(value)

    const isDigits = /^\d+$/.test(str)

    isDigits && str.length >= min && str.length <= max ? resolve(value) : reject()
}))
