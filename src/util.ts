export function getOffset(elem: HTMLElement) {
  let parent = elem.offsetParent as HTMLElement
  let offsetLeft = elem.offsetLeft
  let offsetTop = elem.offsetTop

  while(parent) {
    offsetLeft += parent.offsetLeft
    offsetTop += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }

  return {
    offsetLeft,
    offsetTop
  }
}