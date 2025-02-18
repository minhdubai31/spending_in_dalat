<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
const props = defineProps({
  show: Boolean,
})
</script>
<template>
  <Transition name="fade">
    <div
      v-show="props.show"
      class="duration-300 fixed z-50 w-full h-full bg-black/40 flex backdrop-blur justify-center items-center"
    >
      <div class="bg-gray-100/50 backdrop-blur-lg rounded-2xl p-4 relative">
        <button
          @click="$emit('close')"
          class="absolute cursor-pointer top-2 right-2 z-40 text-2xl text-gray-700 hover:text-gray-800"
        >
          <Icon icon="solar:close-circle-bold-duotone" class="w-7 h-7" />
        </button>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
