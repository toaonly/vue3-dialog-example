import {debounce, uniqueId, capitalize, isPlainObject, isString, random} from 'lodash-es'
import { defineStore } from 'pinia'
import { type App, computed, defineComponent, nextTick, ref, type VNode, watch } from 'vue'
import { BUTTON_COLORS, VConfirm } from '../../'
import { CustomEvent } from '../../utils'
import { ConfirmEvent, CONFIRM_EVENT_TYPES, ConfirmOptions, OpenAlert, OpenAlertForDangerous, OpenBaseConfirm, OpenConfirm, OpenConfirmForDangerous } from './types'

const Emitter = CustomEvent.Emitter
const CONFIRM_ID_PREFIX = random(1e14).toString(32)
const BaseOpenParametersMap = { 0: 'title', 1: 'message', 2: 'icon' }

const overrideParametersToAlertOptions = (...[title, ...args]) => {
  const confirmOptions: ConfirmOptions = !isPlainObject(title) ? { title } : title

  if (args.length > 0) {
    args.forEach((arg, i) => {
      isPlainObject(arg) ? Object.assign(confirmOptions, arg) : (confirmOptions[BaseOpenParametersMap[i + 1]] ??= arg)
    })
  } else {
    Object.assign(confirmOptions, title)
  }

  if (isString(confirmOptions.icon)) {
    confirmOptions.iconName = confirmOptions.icon
  } else {
    confirmOptions.iconName = confirmOptions.icon?.[0]
    confirmOptions.iconColor = confirmOptions.icon?.[1]
  }

  return confirmOptions
}

const openBaseConfirm: OpenBaseConfirm = (...args) => {
  const store = useVConfirmStore()
  const confirmId = store.addConfirm(...args)
  const confirmOptions = store.confirms[confirmId]

  nextTick().then(() => {
    store.setVisible(confirmId, true)
  })

  Emitter.on(
    confirmId,
    (e: ConfirmEvent) => {
      const confirmOptions = store.confirms[confirmId]
      const eventType = `on${capitalize(e.type)}`

      e.id = confirmId
      confirmOptions[eventType]?.(e)

      debounce((event: ConfirmEvent) => {
        const { defaultPrevented, type } = event

        if (defaultPrevented) {
          return (type === CONFIRM_EVENT_TYPES.SHOW && store.setVisible(event.id, false))
        }

        type === CONFIRM_EVENT_TYPES.HIDDEN && store.removeConfirm(event.id)
      }, 0)(e)
    }
  )

  return confirmOptions
}

const useVConfirmStore = defineStore('use-v-confirm', {
  state: () => ({
    confirms: {} as Record<string, ConfirmOptions>,
  }),

  getters: {
    confirmIds: state => Object.keys(state.confirms),
  },

  actions: {
    removeConfirm(id: string) {
      Emitter.listeners(id).forEach(h => {
        Emitter.off(id, h)
      })

      // @ts-ignore
      this.confirms = {
        ...this.confirms,
        [id]: undefined,
      }

      delete this.confirms[id]
    },

    addConfirm(...args: Parameters<OpenBaseConfirm>) {
      const id = uniqueId(CONFIRM_ID_PREFIX)
      const confirmOptions = overrideParametersToAlertOptions(...args)

      confirmOptions.duration ??= 500
      confirmOptions.id ??= id
      confirmOptions.visible = false

      this.confirms = {
        ...this.confirms,
        [id]: confirmOptions
      }

      return id
    },

    emit<T extends string>(id: string, e: CustomEvent<T>) {
      Emitter.emit(id, e)
    },

    setVisible(id: string, visible: boolean) {
      this.confirms = {
        ...this.confirms,
        [id]: {
          ...this.confirms[id],
          visible
        }
      }
    }
  }
})

const _useVConfirm = () => {
  const store = useVConfirmStore()

  return {
    open: openBaseConfirm,
    close: (id: string) => {
      store.setVisible(id, false)
    },
    closeAll: () => {
      store.confirmIds.forEach(id => {
        store.setVisible(id, false)
      })
    }
  }
}

export const labelrAlertInjectionKey = '$labelrAlert'
export const useLabelrAlert = () => {
  const VConfirm = _useVConfirm()

  return {
    open: ((alertOptions, message, icon, options = {}) => {
      return VConfirm.open(alertOptions, message, icon, {
        ...options,
        okOnly: true,
      })
    }) as OpenAlert,
    openForDangerous: ((alertOptions, message, icon, options = {}) => {
      return VConfirm.open(alertOptions, message, icon, {
        ...options,
        okColor: BUTTON_COLORS.DANGER,
        okOnly: true,
      })
    }) as OpenAlertForDangerous,
    close: VConfirm.close,
    closeAll: VConfirm.closeAll,
  }
}

export const VConfirmInjectionKey = '$VConfirm'
export const useVConfirm = () => {
  const VConfirm = _useVConfirm()

  return {
    open: VConfirm.open as OpenConfirm,
    openForDangerous: ((alertOptions, message, icon, options = {}) => {
      return VConfirm.open(alertOptions, message, icon, {
        ...options,
        okColor: BUTTON_COLORS.DANGER,
      })
    }) as OpenConfirmForDangerous,
    close: VConfirm.close,
    closeAll: VConfirm.closeAll,
  }
}

export const VConfirmProvider = defineComponent({
  name: 'VConfirmProvider',

  setup() {
    const store = useVConfirmStore()
    const confirmVNodeMap = ref({} as { id: string; vnode: VNode })
    const confirmVNodes = computed(() => Object.values(confirmVNodeMap.value))

    watch(() => store.confirmIds, ids => {
      ids.forEach(id => {
        const options = store.confirms[id]

        if (!options) return

        confirmVNodeMap.value[id] = (
          <VConfirm
            cancel-only={options.cancelOnly}
            cancel-text={options.cancelText}
            cancel-color={options.cancelColor}
            duration={options.duration}
            // @ts-ignore
            id={id}
            no-close-on-backdrop={options.noCloseOnBackdrop}
            no-close-on-esc={options.noCloseOnEsc}
            ok-only={options.okOnly}
            ok-text={options.okText}
            ok-color={options.okColor}
            visible={options.visible}
            onUpdate:visible={v => {
              store.setVisible(id, v)
            }}
            onHidden={e => {
              store.emit(id, e)

              delete confirmVNodeMap.value[id]
            }}
            onHide={e => store.emit(id, e)}
            onShow={e => store.emit(id, e)}
            onShown={e => store.emit(id, e)}
          >
            {{
              icon: options.icon ? () => (
                <v-icon
                  name={`modal-${options.iconName}`}
                  color={options.iconColor}
                  size="64"
                />
              ) : void 0,

              header: options.title ? () => options.title : void 0,

              contents: () => (
                <div
                  class="text-center whitespace-pre-line break-words"
                  innerHTML={options.message}
                />
              )
            }}
          </VConfirm>
        )
      })
    })

    return () => confirmVNodes.value
  },
})

export default function installUseVConfirm(App: App) {
  App.component('VConfirmProvider', VConfirmProvider)
}
