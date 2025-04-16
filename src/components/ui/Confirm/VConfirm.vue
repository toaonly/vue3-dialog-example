<script lang="ts" setup>
import { reactive, ref, toRefs, type Ref } from 'vue'
import { VDialog } from '../Dialog'
import type { DIALOG_EVENT_TYPE, DIALOG_TRIGGER } from '../Dialog/utils'
import { CONFIRM_TRIGGER } from './constants'
import { BUTTON_COLORS, VButton } from '../Button'
import type { TRANSITION } from '../Transition'
import { CustomEvent } from '../utils'
import { isNil } from 'lodash-es'

type Trigger = DIALOG_EVENT_TYPE | DIALOG_TRIGGER | CONFIRM_TRIGGER

const props = withDefaults(defineProps<{
  aligned?: string
  cancelOnly?: boolean
  cancelText?: string
  cancelColor?: Lowercase<BUTTON_COLORS> | BUTTON_COLORS
  duration?: number
  hideActions?: boolean
  noCloseOnBackdrop?: boolean
  noCloseOnEsc?: boolean
  okOnly?: boolean
  okText?: string
  okColor?: Lowercase<BUTTON_COLORS> | BUTTON_COLORS
  size?: string
  visible?: boolean
  transition?: Lowercase<TRANSITION> | TRANSITION
}>(), {
  cancelColor: BUTTON_COLORS.CLEAR,
  cancelText: '닫기',
  okColor: BUTTON_COLORS.PRIMARY,
  okText: '확인',
})

const emit = defineEmits<{
  'update:visible': [value: boolean],
  cancel: [CustomEvent<CONFIRM_TRIGGER.CANCEL, CONFIRM_TRIGGER.CANCEL>],
  ok: [CustomEvent<CONFIRM_TRIGGER.OK, CONFIRM_TRIGGER.OK>],

  /** Dialog Emits */
  hidden: [
    CustomEvent<
      DIALOG_EVENT_TYPE.HIDDEN,
      DIALOG_EVENT_TYPE.HIDDEN | DIALOG_TRIGGER.ESC | DIALOG_TRIGGER.BACKDROP
    >,
  ]
  hide: [CustomEvent<DIALOG_EVENT_TYPE.HIDE, DIALOG_EVENT_TYPE.HIDE>]
  show: [CustomEvent<DIALOG_EVENT_TYPE.SHOW, DIALOG_EVENT_TYPE.SHOW>]
  shown: [CustomEvent<DIALOG_EVENT_TYPE.SHOWN, DIALOG_EVENT_TYPE.SHOWN>]
  backdrop: [CustomEvent<DIALOG_TRIGGER.BACKDROP, DIALOG_TRIGGER.BACKDROP>],
  esc: [CustomEvent<DIALOG_TRIGGER.ESC, DIALOG_TRIGGER.ESC>],
}>()

const state = reactive({
  trigger: ref() as Ref<Trigger>,
  ...toRefs(props),
})

const emitConfirmEvent = <E extends Trigger | 'update:visible'>(e: CustomEvent<E, E>) => {
  emit(e.type as any, e as any)
}

const hide = (trigger: Trigger) => {
  setTrigger(trigger)
  setVisible(false)
}

const onActionClick = (type: Trigger, trigger: Trigger) => {
  const event = new CustomEvent(type, trigger)

  emitConfirmEvent(event)

  if (event.defaultPrevented) return

  hide(trigger)
}

const onCancel = () => {
  onActionClick(CONFIRM_TRIGGER.CANCEL, CONFIRM_TRIGGER.CANCEL)
}

const onOk = () => {
  onActionClick(CONFIRM_TRIGGER.OK, CONFIRM_TRIGGER.OK)
}

const onHide = (e: CustomEvent<Trigger>) => {
  if (isNil(e.trigger)) {
    e.trigger = state.trigger!
  }

  emitConfirmEvent(e)
}

const onHidden = (e: CustomEvent<Trigger>) => {
  onHide(e)
}

const setTrigger = (trigger?: Trigger) => {
  state.trigger = trigger!
}

const setVisible = (visible: boolean) => {
  emit('update:visible', visible)
}

const show = () => {
  setTrigger()
  setVisible(true)
}
</script>

<template>
  <VDialog :duration="state.duration" dialogClass="v-confirm" :id="$attrs.id as string"
    :noCloseOnBackdrop="state.noCloseOnBackdrop" :noCloseOnEsc="state.noCloseOnEsc" :visible="state.visible"
    :transition="state.transition as any" :onUpdate:visible="setVisible" :onHide="onHide" :onHidden="onHidden"
    :onShow="emitConfirmEvent" :onShown="emitConfirmEvent">
    <header>
      <slot name="header" />
    </header>

    <div class="contents">
      <slot name="contents" />
    </div>

    <div v-if="!state.hideActions" class="actions">
      <div class="buttons">
        <VButton v-if="!state.okOnly" :color="state.cancelColor ?? BUTTON_COLORS.CLEAR" fluid @click="onCancel">
          {{ state.cancelText }}
        </VButton>

        <VButton v-if="!state.cancelOnly" :color="state.okColor ?? BUTTON_COLORS.PRIMARY" @click="onOk" fluid>
          {{ state.okText }}
        </VButton>
      </div>

      <slot name="actions" />
    </div>
  </VDialog>
</template>

<style lang="css">
@import "./style.css";
</style>
