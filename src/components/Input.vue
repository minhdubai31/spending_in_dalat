<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps({
  type: String,
  title: String,
  value: {
    type: [String, Number],
    default: '',
  },
  icon: String,
})

const currentValue = ref(props.value)
const isFocus = ref(false)

watch(isFocus, (newVal) => {
  if (newVal) {
    window.scrollTo({
      top: 9999999, // scroll to the very bottom
      behavior: 'smooth',
    })
  }
})

watch(
  () => props.value,
  (newVal) => {
    currentValue.value = newVal
  },
)

defineEmits(['update:value'])
</script>

<template>
  <div class="bg-white/50 rounded-lg p-1.5 relative flex gap-2 items-center">
    <Icon v-if="props.icon" :icon="props.icon" class="w-5 h-5 ms-1" />
    <div class="w-full">
      <p
        ref="labelRef"
        class="absolute ps-1 top-1/2 -translate-y-1/2 text-center text-gray-600 duration-200 pointer-events-none"
        :class="isFocus || currentValue ? 'text-black text-xs pb-6' : ''"
      >
        {{ props.title }}
      </p>
      <input
        :type="props.type"
        v-model="currentValue"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @input="$emit('update:value', currentValue)"
        class="w-full bg-transparent text-black outline-none px-1 pt-3 mt-1"
      />
    </div>
  </div>
</template>
