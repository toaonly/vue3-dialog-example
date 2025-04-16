<script lang="ts" setup>
import { useReactiveWithProps } from '../hooks'
import { TRANSITION, TRANSITION_HOOKS, type generateHook } from './utils'

import type { BaseTransitionProps } from 'vue'

const props = withDefaults(defineProps<{
  appear?: boolean
  customHook?: ReturnType<typeof generateHook>
  duration?: number | string
  name?: TRANSITION | Lowercase<TRANSITION>
  mode?: BaseTransitionProps['mode']
}>(), {
  duration: 500,
  name: TRANSITION.FADE
})

const state = useReactiveWithProps({
  hooks: () => typeof state.customHook === 'function'
    ? state.customHook(state.duration)
    : TRANSITION_HOOKS[state.name](state.duration)
}, props)
</script>

<template>
  <Transition :appear="state.appear" :mode="state.mode" @before-enter="el => state.hooks.beforeEnter?.(el as any)"
    @enter="(el, done) => state.hooks.enter?.(el as any, done)" @after-enter="el => state.hooks.afterEnter?.(el as any)"
    @before-leave="el => state.hooks.beforeLeave?.(el as any)"
    @leave="(el, done) => state.hooks.leave?.(el as any, done)"
    @after-leave="el => state.hooks.afterLeave?.(el as any)">
    <slot />
  </Transition>
</template>
