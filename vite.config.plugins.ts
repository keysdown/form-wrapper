import {resolve} from 'path'
import {defineConfig} from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
    build: {
        emptyOutDir: false,
        lib: {
            entry: {
                'plugins/formValidation': resolve(__dirname, 'src/plugins/formValidation.ts'),
                'plugins/rules': resolve(__dirname, 'src/plugins/rules/index.ts'),
                'plugins/locales': resolve(__dirname, 'src/plugins/locales/index.ts'),
            },
            formats: ['es', 'cjs'],
        },
        minify: true,
        rolldownOptions: {
            output: {
                exports: 'named',
            },
        },
    },
    plugins: [dtsPlugin({
        insertTypesEntry: true,
        outDirs: ['dist'],
    })]
})
