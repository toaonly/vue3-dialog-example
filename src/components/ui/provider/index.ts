import { App, defineComponent, provide } from 'vue'
import installUseVConfirm, {
  labelrAlertInjectionKey,
  VConfirmInjectionKey,
  useLabelrAlert,
  useVConfirm,
} from './Confirm/Confirm'
export {
  labelrAlertInjectionKey,
  VConfirmInjectionKey,
  useLabelrAlert,
  useVConfirm,
} from './Confirm/Confirm'

export const VueronUiProvider = defineComponent({
  name: 'VueronUiProvider',

  setup(_, { slots }) {
    provide(labelrToastInjectionKey, useLabelrToast())
    provide(labelrAlertInjectionKey, useLabelrAlert())
    provide(VConfirmInjectionKey, useVConfirm())

    return () => (
      <>
        {slots.default?.()}
        <VConfirmProvider />
      </>
    )
  },
})

export default function installComposables(App: App) {
  App.component('VueronUiProvider', VueronUiProvider)

  installUseVConfirm(App)
}
