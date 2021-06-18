import {
    contextBridge,
    ipcRenderer
} from 'electron'

contextBridge.exposeInMainWorld(
    "$bridge_api", {
        emit: (channel:string, ...data: any[]) => {
            ipcRenderer.send(channel, data);
        },
        on: (channel:string, func: any) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        },
        remove: (channel:string) => {
            ipcRenderer.removeAllListeners(channel);
        }
    }
);
