// Resize only the fixed frame, never remount an input or move the selection.
export function listenReadingViewport() {
  const viewport = window.visualViewport
  const root = document.documentElement
  let frame = 0
  function update() {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      // Pinch zoom uses browser panning; avoid fighting it by resizing the dialog.
      const keyboardViewport = viewport && viewport.scale === 1
      root.style.setProperty('--reading-viewport', `${keyboardViewport ? viewport.height : window.innerHeight}px`)
      root.style.setProperty('--reading-viewport-top', `${keyboardViewport ? viewport.offsetTop : 0}px`)
      const field = document.activeElement
      if (field instanceof HTMLElement && field.matches('input, textarea') && field.closest('.lesson-content')) {
        const area = field.closest<HTMLElement>('.lesson-content')!
        const bounds = field.getBoundingClientRect(), visible = area.getBoundingClientRect()
        if (bounds.bottom > visible.bottom) area.scrollTop += bounds.bottom - visible.bottom + 12
        else if (bounds.top < visible.top) area.scrollTop -= visible.top - bounds.top + 12
      }
    })
  }
  viewport?.addEventListener('resize', update)
  viewport?.addEventListener('scroll', update)
  window.addEventListener('resize', update)
  document.addEventListener('focusin', update)
  update()
  return () => {
    cancelAnimationFrame(frame)
    viewport?.removeEventListener('resize', update)
    viewport?.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    document.removeEventListener('focusin', update)
    root.style.removeProperty('--reading-viewport')
    root.style.removeProperty('--reading-viewport-top')
  }
}
