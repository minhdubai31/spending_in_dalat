<script setup lang="ts">
import type { Activity } from '@/constant/activity'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { deleteActivity } from '@/services/realtimeDb'
import moment from 'moment'

const props = defineProps({
  activity: Object as () => Activity,
})

const time = moment(props.activity?.date).format('HH:mm')
const deleteActivityHandler = () => {
  if (!props.activity?.id) {
    return
  }
  deleteActivity(props.activity?.id)
}
</script>
<template>
  <div class="flex gap-2 items-center">
    <p class="text-xs text-black/60">{{ time }}</p>
    <div class="flex gap-1 grow w-full">
      <p class="col-span-8 grow bg-gray-100/50 rounded-full p-1 px-1.5 backdrop-blur-2xl">
        {{ props.activity?.activityName }}
      </p>
      <Icon
        :icon="props.activity?.category.icon || 'solar:palette-round-bold-duotone'"
        class="col w-8 h-8 text-black bg-gray-100/50 rounded-full p-1 px-1.5 backdrop-blur-2xl"
      />
      <p
        class="col-span-3 w-20 text-center bg-gray-100/50 rounded-full p-1 px-1.5 backdrop-blur-2xl"
      >
        {{ Intl.NumberFormat('vi-VN').format(props.activity?.cost || 0) }}đ
      </p>
      <Icon
        :icon="'solar:trash-bin-2-bold-duotone'"
        @click.prevent="deleteActivityHandler"
        class="col-span-1 cursor-pointer w-8 h-8 text-red-600 bg-gray-100/50 rounded-full p-1 px-1.5 backdrop-blur-2xl duration-150 hover:bg-red-600 hover:text-white"
      />
    </div>
  </div>
</template>
