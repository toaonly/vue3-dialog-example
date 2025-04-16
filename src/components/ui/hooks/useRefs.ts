import {
  reactive,
  type ComponentPublicInstance,
  type UnwrapNestedRefs,
} from 'vue'

type $Refs<T> = UnwrapNestedRefs<T>

export const useRefs = <
  T extends Record<string, Element | ComponentPublicInstance | null>,
>() => {
  const refs = reactive({} as T)
  const set = <K extends keyof $Refs<T>>(key: K, ref: $Refs<T>[K]) =>
    (refs[key] = ref)
  const get = <K extends keyof $Refs<T>>(key: K) => refs[key]

  return { get, set }
}
