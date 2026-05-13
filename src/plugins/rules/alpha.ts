import {defineRule} from '../../utils/rule'

export default defineRule('alpha', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const regex = /^[a-zA-Z]+$/

    regex.test(String(value)) ? resolve(value) : reject()
}))
