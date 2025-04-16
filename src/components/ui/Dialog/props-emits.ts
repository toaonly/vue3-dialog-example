import type { CustomEvent } from '../utils'
import type { TRANSITION } from '../Transition'
import type { DIALOG_EVENT_TYPE, DIALOG_TRIGGER } from './utils'

export type DialogProps = {
  duration?: number
  id?: string
  dialogClass?: string
  noCloseOnBackdrop?: boolean
  noCloseOnEsc?: boolean
  transition?: TRANSITION
  visible: boolean
  position?: 'top' | 'bottom' | 'center'
}

export type DialogEmits = {
  'update:visible': [value: boolean]
  hidden: [
    CustomEvent<
      DIALOG_EVENT_TYPE.HIDDEN,
      DIALOG_EVENT_TYPE.HIDDEN | DIALOG_TRIGGER.ESC | DIALOG_TRIGGER.BACKDROP
    >,
  ]
  hide: [CustomEvent<DIALOG_EVENT_TYPE.HIDE, DIALOG_EVENT_TYPE.HIDE>]
  show: [CustomEvent<DIALOG_EVENT_TYPE.SHOW, DIALOG_EVENT_TYPE.SHOW>]
  shown: [CustomEvent<DIALOG_EVENT_TYPE.SHOWN, DIALOG_EVENT_TYPE.SHOWN>]
}

export type DialogEmitFunction = <E extends keyof DialogEmits>(
  event: E,
  ...args: DialogEmits[E]
) => void
