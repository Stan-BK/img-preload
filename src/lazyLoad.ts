import { images } from "./pool";
import type { ImgPoolType } from "./pool";
import { getOffset } from "./util";

let lazySrcAttr: string

export function lazyLoad(isLazy: boolean, attr: string) {
  lazySrcAttr = attr
  let callback
  const arr = []
  for (const image of images) {
    const isVisible = handleImageLoad(image)

    if (!isLazy) {
      loadImg(image)
      continue
    }

    if (!isVisible) {
      callback = handleImageLoad.bind(null, image, callback)
      document.addEventListener('scroll', callback)
    } else {
      arr.push(image)
    }
  }

  isLazy && images.splice(0, images.length, ...arr) // store images in view
}

function handleImageLoad(image: ImgPoolType, callback?: () => any) {
  if (image instanceof SVGImageElement) return
  const { offsetTop } = getOffset(image)

  if (offsetTop > (window.innerHeight + window.scrollY + 500)) { // move up the image load-line
    return false
  } else {
    loadImg(image)
    if (callback) {
      document.removeEventListener('scroll', callback)
    }
    return true
  }
}

function loadImg(image: ImgPoolType) {
  if (image instanceof SVGImageElement) return

  if (image.src === '') {
    image.src = image.getAttribute(lazySrcAttr) as string
  }
}