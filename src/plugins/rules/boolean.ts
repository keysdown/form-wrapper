import {defineRule} from '../../utils/rule'

export default defineRule('boolean', (value: any): Promise<any> => new Promise((resolve, reject) => {
    if (value === null || value === undefined) {
        return reject()
    }

    const acceptable = [true, false, 0, 1, '0', '1']

    acceptable.includes(value) ? resolve(value) : reject()
}))
