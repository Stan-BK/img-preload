import { images } from "./pool";
import { getOffset } from "./util";

export function lazyLoad() {
  let callback
  for (const image of images) {
    const isVisible = handleImageLoad(image)
    
    if (!isVisible) {
      callback = handleImageLoad.bind(null, image, callback)
      document.addEventListener('scroll', callback)
    }
  }
  
}

function handleImageLoad(image: HTMLImageElement, callback?: () => any) {
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

function loadImg(image: HTMLImageElement) {
  if (image.src === '') {
    image.src = image.getAttribute('data-src') as string
  }
}