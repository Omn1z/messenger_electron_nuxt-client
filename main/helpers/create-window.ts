import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Rectangle, app
} from 'electron';

import Store from 'electron-store'
import { join } from 'path'



class CWindowSize implements Rectangle {
  public x: number = 0
  public y: number = 0
  constructor(public width: number, public height: number) {
  }
}

export default (windowName: string, options: BrowserWindowConstructorOptions, isProd: boolean): BrowserWindow => {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = new CWindowSize(options.width ? options.width : 0, options.height ? options.height : 0)

  let state = {};
  let win: BrowserWindow;

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState: Rectangle, bounds: Rectangle) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    // @ts-ignore
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState: Rectangle) => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition())
    }
    store.set(key, state)
    win.destroy()
  };

  state = ensureVisibleOnSomeDisplay(restore() as Rectangle);

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      devTools: !isProd,
      nodeIntegration: true, // is default value after Electron v5
      //contextIsolation: true, // protect against prototype pollution
      //enableRemoteModule: true, // turn off remote
      preload: join(__dirname, 'bridge.js') // use a preload script
    },
  };
  win = new BrowserWindow(browserOptions)
  win.setMovable(true)
  win.on('close', saveState)

  return win;
};
