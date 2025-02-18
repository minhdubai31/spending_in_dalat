import { db } from '@/constant/initFirebase'
import type { Activity } from '@/constant/activity'
import { ref, set, onValue, remove } from 'firebase/database'

async function putNewActivity(activity: Activity) {
  await set(ref(db, 'activities/' + activity.id), activity)
}

function listenForChanges(callbackfn?: (value: Array<Activity>) => void) {
  const starCountRef = ref(db, 'activities')
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callbackfn?.(Object.values(data))
    }
  })
}

async function deleteActivity(id: string) {
  await remove(ref(db, 'activities/' + id))
}

export { putNewActivity, listenForChanges, deleteActivity }
