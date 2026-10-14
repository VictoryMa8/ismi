import { getDeviceSnapshot, updateDeviceSnapshot } from './offline'
import type { CanDoAchievement } from './canDo'

export type CanDoPreferences = { showAchievements: boolean; achievements: CanDoAchievement[] }
const key = (scope: string) => `can-do-v1:${scope}`
const empty = (): CanDoPreferences => ({ showAchievements: true, achievements: [] })
export async function getCanDoPreferences(scope: string): Promise<CanDoPreferences> {
  return await getDeviceSnapshot<CanDoPreferences>(key(scope)) ?? empty()
}
export async function recordCanDoAchievement(scope: string, achievement: CanDoAchievement): Promise<CanDoPreferences> {
  await updateDeviceSnapshot<CanDoPreferences>(key(scope), saved => {
    const value = saved ?? empty()
    if (!value.achievements.some(a => a.id === achievement.id)) value.achievements.push(achievement)
    return value
  })
  return getCanDoPreferences(scope)
}
export async function setCanDoAchievementDisplay(scope: string, showAchievements: boolean): Promise<CanDoPreferences> {
  await updateDeviceSnapshot<CanDoPreferences>(key(scope), saved => ({ ...(saved ?? empty()), showAchievements }))
  return getCanDoPreferences(scope)
}
