import {Items} from '../types/collections'

export class Collection<T> {
    public collection: Items<T> = {}

    public all(): Items<T> {
        return this.collection
    }

    public first(
        key: string
    ): T | null {
        const data = this.get(key)

        if (data) {
            return Array.isArray(data) ? data[0] : data
        }

        return null
    }

    public any(): boolean {
        return Object.keys(this.collection).length > 0
    }

    public fill(
        items: Items<T>
    ): this {
        this.collection = items

        return this
    }

    public push(
        key: string,
        data: any
    ): this {
        this.collection = {
            ...this.collection,
            [key]: data
        }

        return this
    }

    public has(
        key: string
    ): boolean {
        return this.collection.hasOwnProperty(key)
    }

    public get(
        item: string,
        defaultValue: T | null = null
    ): T | null {
        if (!this.has(item)) {
            return defaultValue
        }

        return this.collection[item]
    }

    public unset(
        key: string
    ): this {
        if (this.has(key)) {
            delete this.collection[key]
        }

        return this
    }

    public clear(): this {
        this.collection = {}

        return this
    }
}