export type ImgPoolType = HTMLImageElement | SVGImageElement

export const images: ImgPoolType[] = []
export const loadedImages: ImgPoolType[] = []
export const failedImages: ImgPoolType[] = []

export function initPool(imgs?: ImgPoolType[]) {
  images.splice(0, images.length, ...Array.isArray(imgs) ? imgs : [...Array.from(document.images), ...Array.from(document.querySelectorAll('image'))])
  loadedImages.splice(0, loadedImages.length)
  failedImages.splice(0, failedImages.length)
  return images
}