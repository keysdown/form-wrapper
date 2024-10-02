export interface Rules {
    [key: string]: (value: any, attributes: string[]) => Promise<any>
}