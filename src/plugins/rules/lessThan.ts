import {defineRule} from '../../utils/rule'

export default defineRule('lessThan', (value: any, attributes: string[], form?: any): Promise<any> => new Promise((resolve, reject) => {
    if (!form || !attributes[0]) {
        return reject()
    }

    const otherValue = form[attributes[0]]

    if (typeof value !== 'number' || typeof otherValue !== 'number') {
        return reject()
    }

    value < otherValue ? resolve(value) : reject()
}))
