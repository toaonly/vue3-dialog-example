<script lang="ts" setup>
import useDialog from './hooks'
import { DIALOG_CLASSNAME } from './utils'
import { VTransition, TRANSITION } from '../Transition'
import type { DialogEmits, DialogProps } from './props-emits'

const { CONTAINER, BACKDROP, MAIN } = DIALOG_CLASSNAME

const props = withDefaults(defineProps<DialogProps>(), {
  duration: 500,
  id: crypto.randomUUID(),
  noCloseOnBackdrop: false,
  noCloseOnEsc: false,
  transition: TRANSITION.SLIDE_Y,
  position: 'center'
})

const emit = defineEmits<DialogEmits>()
const { state, actions } = useDialog({ props, emit })
</script>

<template>
  <Teleport to="body">
    <div class="v-dialog">
      <VTransition name="fade" :duration="state.duration">
        <div v-if="state.innerVisible" :class="BACKDROP" :style="{ zIndex: state.zIndex }" />
      </VTransition>
      <VTransition :name="(state.transition as any)" :duration="state.duration">
        <div v-if="state.innerVisible" :id="state.id" :ref="el => (state.$container = el as any)"
          :class="[CONTAINER, state.dialogClass, state.position]" :style="{ zIndex: state.zIndex }" role="dialog"
          tabindex="0" @click="() => !state.noCloseOnBackdrop && actions.onBackdropClick()">
          <div :class="MAIN" @click="e => e.stopPropagation()">
            <slot />
          </div>
        </div>
      </VTransition>
    </div>
  </Teleport>
</template>

<style>
@import "./styles.css";
</style>
