import type { DashboardResponse, LessonResponse, PendingCompletion } from './types'

const databaseName = 'ismi-offline'
const databaseVersion = 1
const lessonStore = 'lessons'
const completionStore = 'pending-completions'
const snapshotStore = 'snapshots'

type Snapshot<T> = {
  key: string
  value: T
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(lessonStore)) {
        database.createObjectStore(lessonStore, { keyPath: 'id' })
      }
      if (!database.objectStoreNames.contains(completionStore)) {
        database.createObjectStore(completionStore, { keyPath: 'completionId' })
      }
      if (!database.objectStoreNames.contains(snapshotStore)) {
        database.createObjectStore(snapshotStore, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function useStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode)
    const request = operation(transaction.objectStore(storeName))

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => reject(transaction.error)
  })
}

export function cacheLesson(lesson: LessonResponse): Promise<IDBValidKey> {
  // Callers can pass Vue reactive objects. IndexedDB cannot clone Proxy objects;
  // lesson packages are JSON contracts, so store a detached JSON snapshot.
  const snapshot: LessonResponse = JSON.parse(JSON.stringify(lesson))
  return useStore(lessonStore, 'readwrite', store => store.put(snapshot))
}

export function getCachedLesson(lessonId: string): Promise<LessonResponse | undefined> {
  return useStore(lessonStore, 'readonly', store => store.get(lessonId))
}

export function getCachedLessonCount(): Promise<number> {
  return useStore(lessonStore, 'readonly', store => store.count())
}

export function cacheDashboard(dashboard: DashboardResponse): Promise<IDBValidKey> {
  const snapshot: Snapshot<DashboardResponse> = { key: 'dashboard', value: JSON.parse(JSON.stringify(dashboard)) }
  return useStore(snapshotStore, 'readwrite', store => store.put(snapshot))
}

export async function getCachedDashboard(): Promise<DashboardResponse | undefined> {
  const snapshot = await useStore<Snapshot<DashboardResponse> | undefined>(
    snapshotStore,
    'readonly',
    store => store.get('dashboard'),
  )
  return snapshot?.value
}

export function queueCompletion(completion: PendingCompletion): Promise<IDBValidKey> {
  return useStore(completionStore, 'readwrite', store => store.put(completion))
}

export function getPendingCompletions(): Promise<PendingCompletion[]> {
  return useStore(completionStore, 'readonly', store => store.getAll())
}

export function removePendingCompletion(completionId: string): Promise<undefined> {
  return useStore(completionStore, 'readwrite', store => store.delete(completionId))
}
