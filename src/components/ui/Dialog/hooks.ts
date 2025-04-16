import { CustomEvent } from '../utils'
import { debounce } from 'lodash-es'
import { fromEvent, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { onMounted, onUnmounted, reactive, ref, type Ref, toRefs, watch } from 'vue'
import { type DialogEmitFunction, type DialogProps } from './props-emits'
import { DIALOG_CLASSNAME, DIALOG_EVENT_TYPE, DIALOG_TRIGGER, zIndexFactory } from './utils'

type KeyupEvent = Omit<KeyboardEvent, 'target'> & { target: Element }

const body = document.body
const { CONTAINER } = DIALOG_CLASSNAME
const zIndex = zIndexFactory()

type UseDialogParamters = {
  props: DialogProps
  emit: DialogEmitFunction
}

export default function useDialog({ props, emit }: UseDialogParamters) {
  const refProps = toRefs(props)
  const state = reactive({
    escKeySubscription: ref() as Ref<Subscription>,
    hideTrigger: ref(null) as Ref<DIALOG_TRIGGER | null>,
    innerVisible: ref(false),
    prevActiveElement: ref(null) as Ref<HTMLElement | null>,
    zIndex: ref(-1),
    $container: ref() as Ref<HTMLElement>,
    ...refProps,
  })
  const actions = {
    addEscKeyEvent() {
      const { $container } = state
      const keyupObservable = fromEvent<KeyupEvent>(window, 'keyup')

      state.escKeySubscription = keyupObservable
        .pipe(
          filter(({ key, target }) => {
            const { visible } = state
            const isValidTraget =
              target === body ||
              target.classList.contains(CONTAINER) ||
              target.closest(`.${CONTAINER}`) === $container

            return isValidTraget && key === 'Escape' && visible
          }),
        )
        .subscribe(() => {
          actions.setHideTrigger(DIALOG_TRIGGER.ESC)
          actions.hide()
        })
    },

    afterChangeVisible() {
      state.innerVisible ? actions.afterShow() : actions.afterHide()
    },

    afterDuration(handler: (...args: any[]) => any) {
      debounce(handler, state.duration)()
    },

    afterHide() {
      state.prevActiveElement?.focus()

      actions.removeEscKeyEvent()
      actions.afterDuration(() => {
        actions.emitWithEvent(DIALOG_EVENT_TYPE.HIDDEN)
      })
    },

    afterShow() {
      actions.setHideTrigger()
      actions.setZIndex()
      !state.noCloseOnEsc && actions.addEscKeyEvent()
      actions.afterDuration(() => {
        actions.focusContainer()
        actions.emitWithEvent(DIALOG_EVENT_TYPE.SHOWN)
      })
    },

    async beforeChangeVisible(visible: boolean, beforeVisible: boolean) {
      const type = visible ? DIALOG_EVENT_TYPE.SHOW : DIALOG_EVENT_TYPE.HIDE
      const defaultPrevented = await actions.emitWithEvent(type, state.hideTrigger!)

      if (visible) state.prevActiveElement = document.activeElement as HTMLElement

      defaultPrevented ? actions.setVisible(beforeVisible) : actions.setInnerVisible(visible)
      return Promise.resolve(!defaultPrevented)
    },

    emitWithEvent(type: DIALOG_EVENT_TYPE, trigger?: DIALOG_TRIGGER) {
      const event = new CustomEvent(type, trigger!)

      emit(type, event as any)
      actions.setHideTrigger()

      return Promise.resolve(event.defaultPrevented)
    },

    focusContainer() {
      state.$container?.focus()
    },

    hide() {
      actions.setVisible(false)
    },

    onBackdropClick() {
      actions.setHideTrigger(DIALOG_TRIGGER.BACKDROP)
      actions.hide()
    },

    removeEscKeyEvent() {
      state.escKeySubscription?.unsubscribe()
    },

    setHideTrigger(trigger?: DIALOG_TRIGGER) {
      state.hideTrigger = trigger!
    },

    setInnerVisible(innerVisible: boolean) {
      state.innerVisible = innerVisible
    },

    setVisible(visible: boolean) {
      emit('update:visible', visible)
    },

    setZIndex() {
      state.zIndex = zIndex.get()
    },

    show() {
      actions.setVisible(true)
    },
  }

  watch(
    () => state.visible,
    (visible, beforeVisible) => {
      if (visible !== state.innerVisible) {
        actions
          .beforeChangeVisible(visible, beforeVisible)
          .then((isChanged) => isChanged && actions.afterChangeVisible())
      }
    },
  )

  onMounted(() => {
    const { visible } = state
    actions.setInnerVisible(visible)
    visible && actions.afterChangeVisible()
  })

  onUnmounted(() => {
    actions.removeEscKeyEvent()
  })

  return { state, actions }
}
