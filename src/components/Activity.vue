<script setup lang="ts">
import type { Activity } from '@/constant/activity'
import { Icon } from '@iconify/vue/dist/iconify.js'
import moment from 'moment'

const props = defineProps({
  activity: Object as () => Activity,
})

const time = moment(props.activity?.date).format('HH:mm')
</script>
<template>
  <div class="flex gap-2 items-center">
    <p class="text-sm">{{ time }}</p>
    <div class="flex gap-1 grow w-full">
      <p class="col-span-8 grow bg-gray-100/50 rounded-full p-1 px-1.5 backdrop-blur-2xl">
        {{ props.activity?.activityName }}
      </p>
      <Icon
        :icon="props.activity?.category.icon || 'solar:palette-round-bold-duotone'"
        class="col w-8 h-8 text-black bg-gray-100/50 rounded-full p-1 px-1.5 backdrop-blur-2xl"
      />
      <p
        class="col-span-3 w-24 text-center bg-gray-100/50 rounded-full p-1 px-1.5 backdrop-blur-2xl"
      >
        {{ Intl.NumberFormat('vi-VN').format(props.activity?.cost || 0) }}đ
      </p>
    </div>
  </div>
</template>
