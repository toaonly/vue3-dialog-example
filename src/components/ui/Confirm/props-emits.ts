import type { ExtractPropTypes, PropType } from 'vue'
import { BUTTON_COLORS } from '../Button'
import { CustomEvent } from '../utils'
import { DIALOG_EVENT_TYPE, DIALOG_TRIGGER } from '../Dialog/utils'
import { CONFIRM_TRIGGER } from './constants'

export const confirmProps = {
  aligned: String,
  cancelOnly: Boolean,
  cancelText: {
    type: String,
    default: '닫기',
  },
  cancelColor: {
    type: String as PropType<Lowercase<BUTTON_COLORS> | BUTTON_COLORS>,
    default: BUTTON_COLORS.CLEAR,
  },
  duration: {
    type: Number,
    default: 500,
  },
  hideActions: Boolean,
  noCloseOnBackdrop: Boolean,
  noCloseOnEsc: Boolean,
  okOnly: Boolean,
  okText: {
    type: String,
    default: '확인',
  },
  okColor: {
    type: String as PropType<Lowercase<BUTTON_COLORS> | BUTTON_COLORS>,
    default: BUTTON_COLORS.PRIMARY,
  },
  size: String,
  visible: Boolean,
  transition: String,
}

export const confirmEmits = {
  cancel: () => true,
  ok: () => true,
  'update:visible': () => true,

  /** Dialog Emits */
  hide: () => true,
  hidden: () => true,
  show: () => true,
  shown: () => true,
  backdrop: () => true,
  esc: () => true,
} as ModalEmits

export type ModalProps = ExtractPropTypes<typeof confirmProps>

export type ModalBaseEvent<T extends string> = (e: CustomEvent<T>) => void

export type ModalEmits = {
  cancel: ModalBaseEvent<CONFIRM_TRIGGER.CANCEL>
  ok: ModalBaseEvent<CONFIRM_TRIGGER.OK>
  'update:visible'(visible: boolean): void

  hide: ModalBaseEvent<DIALOG_EVENT_TYPE.HIDE>
  hidden: ModalBaseEvent<DIALOG_EVENT_TYPE.HIDDEN>
  show: ModalBaseEvent<DIALOG_EVENT_TYPE.SHOW>
  shown: ModalBaseEvent<DIALOG_EVENT_TYPE.SHOWN>
  backdrop: ModalBaseEvent<DIALOG_TRIGGER.BACKDROP>
  esc: ModalBaseEvent<DIALOG_TRIGGER.ESC>
}

export type ModalEmitEvents = keyof ModalEmits

export type ModalEmitParameters = {
  [key in ModalEmitEvents]: Parameters<ModalEmits[key]>
}

export type ModalEmitFn = <T extends ModalEmitEvents>(
  event: T,
  ...args: ModalEmitParameters[T]
) => void
