import { computed, reactive, toRefs } from 'vue'
import type { DefineComponent, VNode } from 'vue'

export const useProps = <P extends object>(props: P) => reactive(toRefs(props))

export const useReactiveWithProps = <R extends Record<string, any>, P extends object>(
  refs: R,
  props?: P,
) =>
  reactive({
    ...(props
      ? Object.entries(props).reduce(
          (acc, [key, val]) => {
            return {
              ...acc,
              [key]: computed(() => val),
            }
          },
          {} as {
            readonly [K in keyof P]: P[K]
          },
        )
      : ({} as P)),
    ...Object.entries(refs).reduce(
      (acc, [key, val]) =>
        Object.assign(acc, {
          [key]: typeof val === 'function' ? computed(val) : val,
        }),
      {} as {
        [K in keyof R]: R[K] extends (...args: any[]) => any
          ? ReturnType<R[K] & ((...args: any[]) => any)> extends VNode
            ? DefineComponent
            : K extends 'Tag'
              ? DefineComponent
              : ReturnType<R[K] & ((...args: any[]) => any)>
          : R[K]
      },
    ),
  })
