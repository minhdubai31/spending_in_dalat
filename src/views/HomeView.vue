<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  putNewActivity,
  listenForChanges,
  putBudget,
  listenForBudgetChanges,
} from '@/services/realtimeDb'
import type { Activity, Category, TotalByCategory } from '@/constant/activity'
import { CategoryList } from '@/constant/activity'
import { uuidGenerator } from '@/utils/uuid'
import { Icon } from '@iconify/vue'
import Input from '@/components/Input.vue'
import ActivityItem from '@/components/Activity.vue'
import Modal from '@/components/Modal.vue'
import moment from 'moment'

const name = ref<string>('')
const category = ref<Category>(CategoryList[0])
const cost = ref<number>()

const activities = ref<Array<Activity>>([])
const totals = ref<Array<TotalByCategory>>([])

const initBudget = ref<number>(0)
const budget = ref<number>(0)
const budgetInput = ref<number>(0)
const showModal = ref<boolean>(false)

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
  activities.value = []
  totals.value = []
  data.forEach((activity) => {
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
  })

  let total = totals.value.reduce((acc, cur) => acc + cur.total, 0)
  budget.value = initBudget.value - total
}

const updateBudget = (num: number) => {
  initBudget.value = num

  let total = totals.value.reduce((acc, cur) => acc + cur.total, 0)
  budget.value = initBudget.value - total
}

const setInitBudget = (num: number) => {
  putBudget(num)
  showModal.value = false
}

onMounted(() => {
  listenForBudgetChanges(updateBudget)
  listenForChanges(updateActivityList)
})
</script>

<template>
  <Modal :show="showModal" @close="showModal = false">
    <p class="text-center mb-4">Số tiền vị chi</p>
    <Input
      :type="'number'"
      :title="'Số tiền vị chi'"
      :value="initBudget"
      @update:value="budgetInput = $event"
    />
    <div class="text-center">
      <button
        class="p-1.5 px-5 mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        @click.prevent="setInitBudget(budgetInput)"
      >
        Lưu
      </button>
    </div>
  </Modal>
  <div class="flex flex-col h-full">
    <button class="p-1 cursor-pointer" @click="showModal = true">
      <Icon :icon="'solar:safe-circle-line-duotone'" class="absolute top-6 right-3 w-8 h-8 z-10" />
    </button>
    <h1 class="text-xl pt-5 font-medium text-center backdrop-blur-2xl">Hoạt động chi tiêu</h1>
    <div class="m-4 bg-gray-100/50 backdrop-blur-2xl rounded-3xl p-4 flex flex-col gap-4">
      <div>
        <p class="text-center text-xs">Số dư</p>
        <p class="text-center font-semibold text-4xl">
          {{ Intl.NumberFormat('vi-VN').format(budget) }}đ
        </p>
      </div>
      <div class="grid grid-cols-2 gap-2">
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
    </div>
    <div class="grow h-full overflow-auto flex flex-col gap-2 px-4">
      <div v-for="(item, index) in activities" :key="item.id">
        <p
          v-if="
            index == 0 ||
            moment(item.date).format('DD/MM/YYYY') !=
              moment(activities[index - 1]?.date).format('DD/MM/YYYY')
          "
          class="mb-2 mt-3"
        >
          {{ moment(item.date).format('DD/MM/YYYY') }}
        </p>
        <ActivityItem :activity="item" />
      </div>
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
            class="rounded-full p-1.5 px-2 flex gap-1.5 items-center duration-150 cursor-pointer"
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
