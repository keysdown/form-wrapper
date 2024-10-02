import {Collection} from '../utils/collections'

export class Errors extends Collection<string[]> {
    public push(
        item: string,
        data: any,
    ): this {
        const currentItem = this.get(item) || []

        this.collection = {
            ...this.collection,
            [item]: [...currentItem, data]
        }

        return this
    }

    public get(key: string): string[] | null {
        return super.get(key, [])
    }
}