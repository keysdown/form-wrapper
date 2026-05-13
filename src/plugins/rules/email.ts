import {defineRule} from '../../utils/rule'

export default defineRule('email', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
        return reject()
    }

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    regex.test(String(value)) ? resolve(value) : reject()
}))
