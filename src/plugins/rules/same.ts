import {defineRule} from '../../utils/rule'

export default defineRule('same', (value: any, attributes: string[], form?: any): Promise<any> => new Promise((resolve, reject) => {
    if (!form || !attributes[0]) {
        return reject()
    }

    const otherValue = form[attributes[0]]

    value === otherValue ? resolve(value) : reject()
}))
