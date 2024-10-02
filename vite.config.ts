import {resolve} from 'path'
import {defineConfig} from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'FormWrapper',
            fileName: 'form-wrapper',
            formats: ['es', 'cjs', 'umd', 'iife']
        },
        rollupOptions: {
            output: {
                exports: 'named'
            },
        },
    },
    plugins: [dtsPlugin({
        insertTypesEntry: true
    })]
})