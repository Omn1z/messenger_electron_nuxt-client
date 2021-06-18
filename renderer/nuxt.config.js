import { resolve } from 'path'

export default {
    dev: process.env.NODE_ENV !== 'production',
    target: 'static',
    ssr: false,
    srcDir: __dirname,
    head: {
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        title: 'Fecurity Messenger',
    },
    css: ['~assets/styles/include.scss'],
    modules: [
        '@nuxtjs/axios',
        'cookie-universal-nuxt'
    ],
    buildModules: [
        '@nuxt/typescript-build',
        '@nuxt/components',
        '@nuxtjs/composition-api/module',
    ],
    plugins: [
        '~plugins/axios',
        '~plugins/storage',
        '~plugins/socket',
        '~plugins/cookie',
        '~plugins/electron',
    ],
    socketIO : {
        baseURL: 'http://194.58.98.158:3333/', //'http://127.0.0.1:3333/',
    },
    axios: {
        credentials: true,
        baseURL: 'http://194.58.98.158:3333/', //'http://127.0.0.1:3333/',
        common: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    },
    build: {
        extend: (config) => {
            config.module.rules.push({
                test: /.scss$/,
                use: 'webpack-import-glob-loader'
            })
            config.module.rules.push({
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            })
        }
    },
    generate: {
        interval: 2000,
    },
    typescript: {
        typeCheck: {
            typescript: {
                transpileOnly: true,
                context: __dirname //resolve(__dirname, '..'),
            }
        }
    }
}
