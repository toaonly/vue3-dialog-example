<script lang="ts" setup>
import { useReactiveWithProps, useRefs } from '../hooks'
import type { BUTTON_COLORS } from './utils'

import type { Vu } from '../types'

const props = withDefaults(defineProps<{
  circle?: boolean
  disabled?: boolean
  color?: BUTTON_COLORS | Lowercase<BUTTON_COLORS>
  fluid?: boolean
  noBorder?: boolean
  outlined?: boolean
  size?: Vu.UISize
  tabindex?: number
}>(), {
  color: 'primary',
  size: 'md'
})
const emit = defineEmits<{
  (name: 'click', e: Vu.MouseEventHandler<HTMLButtonElement>): void
}>()
const refs = useRefs<{
  $el: HTMLButtonElement
}>()
const state = useReactiveWithProps({
  hostClass: () => ({
    'v-button': true,
    'no-border': props.noBorder,
    fluid: props.fluid,
    circle: props.circle,
    [props.color as string]: true,
    [`v-button-size-${props.size}`]: true,
    outlined: props.outlined
  }),
  Tag: () => 'button',
}, props)
</script>

<template>
  <state.Tag :ref="el => refs.set('$el', el as HTMLButtonElement)" :class="state.hostClass" :disabled="props.disabled"
    :tabindex="state.tabindex" role="button" @click="emit('click', $event as Vu.MouseEventHandler<HTMLButtonElement>)">
    <slot />
  </state.Tag>
</template>

<style scoped>
@import "./styles.css";
</style>
