import { debounce } from 'lodash-es'

type TransitionOptions = {
  property: string
  duration?: number | string
  timingFunction?: string
}

type TransitionHookFn<T = () => void> = T

type GenerateHookParameter<T extends Element> = {
  beforeEnter?: TransitionHookFn<(el: T) => void>
  enter?: TransitionHookFn<(el: T, done: () => void) => void>
  afterEnter?: TransitionHookFn<(el: T) => void>
  beforeLeave?: TransitionHookFn<(el: T) => void>
  leave?: TransitionHookFn<(el: T, done: () => void) => void>
  afterLeave?: TransitionHookFn<(el: T) => void>
  transitions?: Omit<TransitionOptions, 'duration'>[]
}

export enum TRANSITION {
  SLIDE_X = 'slide_x',
  SLIDE_REVERSE_X = 'slide_reverse_x',
  SLIDE_Y = 'slide_y',
  SLIDE_REVERSE_Y = 'slide_reverse_y',
  FADE = 'fade',
  SCALE = 'scale',
}

const alwaysReturnFunction = <T extends (...args: any[]) => any>(func?: T) =>
  typeof func === 'function' ? func : () => void 0

const createTransition = (t: TransitionOptions) =>
  `${t.property} ${t.duration ?? 0}ms ${t.timingFunction}`

const setStyle = (
  el: HTMLElement,
  key: keyof Omit<CSSStyleDeclaration, 'length' | 'parentRule'>,
  value: any,
) => ((el as HTMLElement).style[key] = value)

export const generateHook =
  <T extends HTMLElement = HTMLElement>({
    beforeEnter,
    enter,
    afterEnter,
    beforeLeave,
    leave,
    afterLeave,
    transitions,
  }: GenerateHookParameter<T>) =>
  (duration: number | string = 0) =>
    ({
      beforeEnter: (el) => {
        setStyle(
          el,
          'transition',
          (transitions ?? [])?.map((t) => createTransition({ ...t, duration })).join(','),
        )

        return alwaysReturnFunction(beforeEnter)(el)
      },
      enter: debounce(alwaysReturnFunction(enter), 0),
      afterEnter: alwaysReturnFunction(afterEnter),
      beforeLeave: (el) => {
        setStyle(
          el,
          'transition',
          (transitions ?? [])?.map((t) => createTransition({ ...t, duration })).join(','),
        )

        return alwaysReturnFunction(beforeLeave)(el)
      },
      leave: debounce(alwaysReturnFunction(leave), +duration),
      afterLeave: alwaysReturnFunction(afterLeave),
    }) as Omit<GenerateHookParameter<T>, 'transitions'>

export const TRANSITION_HOOKS = {
  [TRANSITION.FADE]: generateHook({
    beforeEnter: (el) => {
      setStyle(el, 'opacity', '0')
    },

    enter: (el, done) => {
      setStyle(el, 'opacity', '1')
      done()
    },

    beforeLeave: (el) => {
      setStyle(el, 'opacity', '0')
    },

    leave: (_, done) => {
      done()
    },

    transitions: [
      {
        property: 'opacity',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
    ],
  }),

  [TRANSITION.SLIDE_X]: generateHook({
    beforeEnter: (el) => {
      setStyle(el, 'opacity', '0')
      setStyle(el, 'transform', 'translateX(-20%)')
    },

    enter: (el, done) => {
      setStyle(el, 'transform', 'translateX(0)')
      setStyle(el, 'opacity', '1')
      done()
    },

    beforeLeave: (el) => {
      setStyle(el, 'transform', 'translateX(-20%)')
      setStyle(el, 'opacity', '0')
    },

    leave: (_, done) => {
      done()
    },

    transitions: [
      {
        property: 'transform',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
      {
        property: 'opacity',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
    ],
  }),

  [TRANSITION.SLIDE_REVERSE_X]: generateHook({
    beforeEnter: (el) => {
      setStyle(el, 'opacity', '0')
      setStyle(el, 'transform', 'translateX(20%)')
    },

    enter: (el, done) => {
      setStyle(el, 'transform', 'translateX(0)')
      setStyle(el, 'opacity', '1')
      done()
    },

    beforeLeave: (el) => {
      setStyle(el, 'transform', 'translateX(20%)')
      setStyle(el, 'opacity', '0')
    },

    leave: (_, done) => {
      done()
    },

    transitions: [
      {
        property: 'transform',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
      {
        property: 'opacity',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
    ],
  }),

  [TRANSITION.SLIDE_Y]: generateHook({
    beforeEnter: (el) => {
      setStyle(el, 'opacity', '0')
      setStyle(el, 'transform', 'translateY(-20%)')
    },

    enter: (el, done) => {
      setStyle(el, 'transform', 'translateY(0)')
      setStyle(el, 'opacity', '1')
      done()
    },

    beforeLeave: (el) => {
      setStyle(el, 'transform', 'translateY(-20%)')
      setStyle(el, 'opacity', '0')
    },

    leave: (_, done) => {
      done()
    },

    transitions: [
      {
        property: 'transform',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
      {
        property: 'opacity',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
    ],
  }),

  [TRANSITION.SLIDE_REVERSE_Y]: generateHook({
    beforeEnter: (el) => {
      setStyle(el, 'opacity', '0')
      setStyle(el, 'transform', 'translateY(20%)')
    },

    enter: (el, done) => {
      setStyle(el, 'transform', 'translateY(0)')
      setStyle(el, 'opacity', '1')
      done()
    },

    beforeLeave: (el) => {
      setStyle(el, 'transform', 'translateY(20%)')
      setStyle(el, 'opacity', '0')
    },

    leave: (_, done) => {
      done()
    },

    transitions: [
      {
        property: 'transform',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
      {
        property: 'opacity',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
    ],
  }),

  [TRANSITION.SCALE]: generateHook({
    beforeEnter: (el) => {
      setStyle(el, 'opacity', '0')
      setStyle(el, 'transform', 'scale(0)')
    },

    enter: (el, done) => {
      setStyle(el, 'opacity', '1')
      setStyle(el, 'transform', 'scale(1)')
      done()
    },

    beforeLeave: (el) => {
      setStyle(el, 'opacity', '0')
      setStyle(el, 'transform', 'scale(0)')
    },

    leave: (_, done) => {
      done()
    },

    transitions: [
      {
        property: 'opacity',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
      {
        property: 'transform',
        timingFunction: 'cubic-bezier(0.23, 1, 0.320, 1)',
      },
    ],
  }),
}
