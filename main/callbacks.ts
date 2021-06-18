import {BrowserWindow, ipcMain, IpcMainEvent, shell} from 'electron'

declare module 'electron' {
    interface WindowOptions {
        transparent: boolean
    }
    interface WebContents {
        browserWindowOptions: WindowOptions
    }
}


export default (window: BrowserWindow): void => {
    const emit = (eventName: string, ...args: any[]) => {
        window.webContents.send(eventName, ...args);
    }

    const on = (eventName: string, func: (event: IpcMainEvent, args: any) => void) => {
        ipcMain.on(eventName, (event: IpcMainEvent, ...args: any) => {
            return func(event, args[0][0])
        });
    }

    const remove = (eventName: string) => {
        ipcMain.removeAllListeners(eventName)
    }

    on("close", () => {
        window.close()
    })
    on("minimize", () => {
        window.minimize()
    })
    on("maximize", (event: IpcMainEvent) => {
        window.maximize()
    })
    on("unmaximize", (event: IpcMainEvent) => {
        window.unmaximize()
    })

    on("test", (event: IpcMainEvent, args: any[]) => {
        const responseCallback:string = args.pop()
        emit(responseCallback, args[0][0] ^ 21, args[0][0] % 5)
    });

    on("get_maximized", (event: IpcMainEvent, args: any[]) => {
        const responseCallback:string = args.pop()
        emit(responseCallback, window.isMaximized())
    });

    const WM_SIZE = 0x0005
    const WM_MOVE = 0x0003
    window.hookWindowMessage(WM_SIZE, (wParam: any, lParam: any) => {
        emit('update_window_information', window.isMaximized())
    })

    window.hookWindowMessage(WM_MOVE, (wParam: any, lParam: any) => {
        emit('update_window_information', window.isMaximized())
    })

    on("openExternalUrl", async (event: IpcMainEvent, url: string) => {
        await shell.openExternal(url)
    })


    /*window.setAlwaysOnTop(false)
window.setFocusable(true)
window.setIgnoreMouseEvents(false)*/

    /*window.focus()
           window.setAlwaysOnTop(true)
           window.setIgnoreMouseEvents(true)*/
}
