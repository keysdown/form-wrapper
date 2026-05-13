import {defineRule} from '../../utils/rule'

export default defineRule('url', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    try {
        new URL(String(value))
        resolve(value)
    } catch {
        reject()
    }
}))
