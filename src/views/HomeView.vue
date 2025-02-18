<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { putNewActivity, listenForChanges, deleteActivity } from '@/services/realtimeDb'
import type { Activity, Category, TotalByCategory } from '@/constant/activity'
import { CategoryList } from '@/constant/activity'
import { uuidGenerator } from '@/utils/uuid'
import { Icon } from '@iconify/vue'
import Input from '@/components/input.vue'
import ActivityItem from '@/components/Activity.vue'

const name = ref<string>('')
const category = ref<Category>(CategoryList[0])
const cost = ref<number>()

const activities = ref<Array<Activity>>([])
const totals = ref<Array<TotalByCategory>>([])

const addActivity = () => {
  if (!category.value) {
    return
  }

  const activity: Activity = {
    id: uuidGenerator(),
    activityName: name.value,
    category: category.value,
    cost: cost.value || 0,
    date: new Date().getTime(),
  }

  name.value = ''
  category.value = CategoryList[0]
  cost.value = undefined
  putNewActivity(activity)
}

const isFormValid = computed(() => {
  return !name.value.trim() || !category.value || !cost.value
})

const updateActivityList = (data: Array<Activity>) => {
  data.forEach((activity) => {
    const isNew: boolean = !activities.value.some((i: Activity) => i.id == activity.id)
    if (isNew) {
      activities.value.push(activity)
      const existingTotal = totals.value.find((i) => i.category.name === activity.category.name)

      if (existingTotal) {
        existingTotal.total += activity.cost
      } else {
        totals.value.push({
          category: activity.category,
          total: activity.cost,
        })
      }
    }
  })
}

onMounted(() => {
  listenForChanges(updateActivityList)
})
</script>

<template>
  <div class="flex flex-col h-full">
    <h1 class="text-xl pt-5 font-medium text-center backdrop-blur-2xl">Hoạt động chi tiêu</h1>
    <div class="m-4 bg-gray-100/50 backdrop-blur-2xl rounded-3xl p-4 grid grid-cols-2 gap-2">
      <div
        v-for="total in totals"
        :key="total.category.name"
        class="col-auto flex gap-2 items-center"
      >
        <Icon :icon="total.category.icon || 'solar:palette-round-bold-duotone'" class="w-6 h-6" />
        <p class="text-sm">{{ total.category.name }}:</p>
        <p class="text-sm">{{ Intl.NumberFormat('vi-VN').format(total.total) }}đ</p>
      </div>
    </div>
    <div class="grow h-full overflow-auto flex flex-col gap-2 px-4">
      <ActivityItem v-for="item in activities" :key="item.id" :activity="item" />
    </div>
    <div class="w-full p-4">
      <form
        class="w-full bg-gray-100/50 backdrop-blur-2xl rounded-3xl p-4"
        @submit.prevent="addActivity"
      >
        <div class="flex gap-2 w-full overflow-x-auto rounded-lg">
          <button
            v-for="item in CategoryList"
            @click.prevent="category = item"
            :key="item.name"
            class="rounded-full p-1.5 px-2 flex gap-1.5 items-center duration-150"
            :class="
              category?.name === item.name ? 'bg-blue-500 text-white' : 'bg-white/50 text-black'
            "
          >
            <Icon :icon="item.icon" class="w-6 h-6" />
            <span class="text-sm whitespace-nowrap">{{ item.name }}</span>
          </button>
        </div>
        <div class="flex flex-col gap-2 mt-3">
          <Input
            :type="'text'"
            :title="'Hoạt động'"
            :value="name"
            :icon="'solar:running-2-bold-duotone'"
            @update:value="name = $event"
          />
          <Input
            :type="'number'"
            :icon="'solar:chat-round-money-bold-duotone'"
            :value="cost"
            :title="'Thiệt hại'"
            @update:value="cost = $event"
          />
        </div>
        <div class="flex justify-center">
          <button
            type="submit"
            class="bg-red-600 hover:bg-red-700 disabled:h-0 disabled:py-0.5 h-10 overflow-hidden duration-500 text-white rounded-full p-1.5 px-4 mt-3"
            :disabled="isFormValid"
          >
            Thêm
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
