import { expect, type Page } from '@playwright/test'

export const courseSwitch = (page: Page) => page.getByRole('button', { name: 'Switch language or course', exact: true })

export async function chooseCourse(page: Page, id: string) {
  await expect(courseSwitch(page)).toBeEnabled()
  await courseSwitch(page).click()
  await page.locator(`.course-picker button[data-course="${id}"]`).first().click()
  await expectViewedCourse(page, id)
}

export const expectViewedCourse = (page: Page, id: string) =>
  expect(page.locator('.course-switcher')).toHaveAttribute('data-course', id)
