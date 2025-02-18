// TODO: Define activity model
export type Activity = {
  id: string
  activityName: string
  category: Category
  cost: number
  date: number
}

export type Category = {
  name: string
  icon: string
}

export const CategoryList: Array<Category> = [
  {
    name: 'Đồ ăn',
    icon: 'solar:donut-bitten-bold-duotone',
  },
  {
    name: 'Đồ uống',
    icon: 'solar:cup-hot-bold-duotone',
  },
  {
    name: 'Mua sắm',
    icon: 'solar:bag-4-bold-duotone',
  },
  {
    name: 'Khác',
    icon: 'solar:palette-round-bold-duotone',
  },
]

export type TotalByCategory = {
  total: number
  category: Category
}
