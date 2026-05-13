import {defineRule} from '../../utils/rule'

export default defineRule('required', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === undefined || value === null) {
        return reject()
    }

    const str = String(value).replace(/\s/g, '')

    str.length > 0 ? resolve(value) : reject()
}))
