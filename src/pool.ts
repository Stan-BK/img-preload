export interface ImagePoolItem{
  image: HTMLImageElement
  comment: Comment
}

export const images: ImagePoolItem[] = []
export const loadedImages: HTMLImageElement[] = []
export const failedImages: HTMLImageElement[] = []

export function initPool(imgs: ArrayLike<HTMLImageElement>) {
  images.splice(0, images.length, ...Array.from(imgs).map(img => {
    return {
      image: img,
      comment: document.createComment('img-place')
    }
  }))
}