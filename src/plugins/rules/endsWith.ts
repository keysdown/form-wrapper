import {defineRule} from '../../utils/rule'

export default defineRule('endsWith', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    if (!attributes.length) {
        return reject()
    }

    const str = String(value)
    const hasMatch = attributes.some(suffix => str.endsWith(suffix))

    hasMatch ? resolve(value) : reject()
}))
