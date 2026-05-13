import {defineRule} from '../../utils/rule'

export default defineRule('regex', (value: any, attributes: string[]): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    if (!attributes[0]) {
        return reject()
    }

    const pattern = attributes[0]

    const match = pattern.match(/^\/(.+)\/([gimsuy]*)$/)

    if (!match) {
        return reject()
    }

    const regex = new RegExp(match[1], match[2])

    regex.test(String(value)) ? resolve(value) : reject()
}))
