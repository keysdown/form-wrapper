import {defineRule} from '../../utils/rule'

export default defineRule('alphaNumeric', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const regex = /^[a-zA-Z0-9]+$/

    regex.test(String(value)) ? resolve(value) : reject()
}))
