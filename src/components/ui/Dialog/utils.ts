export enum DIALOG_CLASSNAME {
  CONTAINER = 'v-dialog-container',
  BACKDROP = 'v-dialog-backdrop',
  MAIN = 'v-dialog-main',
}

export enum DIALOG_EVENT_TYPE {
  HIDE = 'hide',
  HIDDEN = 'hidden',
  SHOW = 'show',
  SHOWN = 'shown',
}

export enum DIALOG_TRIGGER {
  BACKDROP = 'backdrop',
  ESC = 'esc',
}

export const zIndexFactory = () => {
  let zIndex = 2000

  return {
    get() {
      return zIndex++
    },
  }
}

export type DIALOG_TRIGGER_KEY = keyof typeof DIALOG_TRIGGER
export type DIALOG_TRIGGER_VALUE = (typeof DIALOG_TRIGGER)[DIALOG_TRIGGER_KEY]
