import { images } from "./pool";
import { getOffset } from "./util";
import { ImagePoolItem } from "./pool";

export function lazyLoad() {
  for (const item of images) {
    const isVisible = handleImageLoad(item)
    
    if (!isVisible && !item.image.complete) {
      document.replaceChild(item.image, item.comment)
      document.addEventListener('scroll', handleImageLoad.bind(null, item))
    }
  }
  
}

function handleImageLoad(item: ImagePoolItem) {
  const { image, comment } = item 
  const { offsetTop } = getOffset(image)

  if (offsetTop > (window.innerHeight + window.scrollY - 100)) { // move up the image load-line
    document.replaceChild(comment, image)
    comment.remove()
    return false
  } else {
    return true
  }
}