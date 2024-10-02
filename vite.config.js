import {resolve} from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'FormWrapper',
            fileName: (format) => `form-wrapper.${format}.js`
        },
        rollupOptions: {
            output: {
                exports: 'named'
            },
        },
    },
})