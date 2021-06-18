import { defineNuxtPlugin } from '@nuxtjs/composition-api'

interface ElectronBridge {
    emit(channel:string, ...data: any[]): void
    on(channel:string, func: any): void
    remove(channel:string): void
    request(channel:string, ...data: any[]): Promise<any[]>
}

declare global {
    interface Window {
        $bridge_api: ElectronBridge
    }
}

class CElectronBridge implements ElectronBridge {
    protected _wnd: any = null

    constructor() {
    }

    public get window(): Window {
        return this._wnd;
    }

    public set window(value: Window) {
        this._wnd = value
    }

    public emit(channel:string, ...data: any[]) {
        this.window.$bridge_api.emit(channel, data);
    }
    public on(channel:string, func: any) {
        this.window.$bridge_api.on(channel, func);
    }
    public remove(channel:string) {
        this.window.$bridge_api.remove(channel);
    }
    public request(channel:string, ...data: any[]) {
        return new Promise<any[]>((resolve: (value: any[]) => void) => {
            const responseCallback = Date.now().toString(16) + '_' + channel
            this.on(responseCallback, (...data: any[]) => {
                this.remove(responseCallback)
                resolve(data)
            })
            this.emit(channel, data, responseCallback)
        });
    }
    public openExternalUrl (url: string) {
        this.window.$bridge_api.emit('openExternalUrl', url)
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $electron: CElectronBridge
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $electron: CElectronBridge
    }
    interface Context {
        $electron: CElectronBridge
    }
}

declare module 'vuex/types/index' {
    interface Store<S> {
        $electron: CElectronBridge
    }
}

export default defineNuxtPlugin((ctx, inject) => {
    inject('electron', new CElectronBridge())
})
