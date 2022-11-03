export function getOffset(elem: HTMLElement) {
  let parent = elem.parentElement
  let offsetLeft = elem.offsetLeft
  let offsetTop = elem.offsetTop

  while(parent) {
    offsetLeft += parent.offsetLeft
    offsetTop += parent.offsetTop
    parent = parent.parentElement
  }

  return {
    offsetLeft,
    offsetTop
  }
}