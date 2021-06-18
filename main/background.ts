import { app, globalShortcut, session } from 'electron';
import serve from 'electron-serve';
import {
  createWindow,
  exitOnChange
} from './helpers';

import registerBridgeCallbacks from './callbacks'
import main from "~/renderer/pages/main.vue";

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const isProd: boolean = process.env.NODE_ENV === 'production'

app.on('window-all-closed', () => {
  app.quit();
})

if (isProd) {
  serve({ directory: 'app' })
} else {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1012,
    height: 726,
    autoHideMenuBar: true,
    minWidth: 1012,
    minHeight: 726,
    frame: false,
    resizable: true
  }, isProd)

  registerBridgeCallbacks(mainWindow)

  mainWindow.hookWindowMessage(0x100, (wParam: any, lParam: any) => {

    //console.log(`wParam: 0x${wParam.toString().charCodeAt(0).toString(16)}, lParam: ${lParam.toString()}`)
  })

  if (isProd) {
    globalShortcut.register("CommandOrControl+R", () => {})

    await mainWindow.loadURL('app://./welcome')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/welcome`)
  }
})();
