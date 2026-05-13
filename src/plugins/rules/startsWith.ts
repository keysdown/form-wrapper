import {defineRule} from '../../utils/rule'

export default defineRule('startsWith', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    if (!attributes.length) {
        return reject()
    }

    const str = String(value)
    const hasMatch = attributes.some(prefix => str.startsWith(prefix))

    hasMatch ? resolve(value) : reject()
}))
