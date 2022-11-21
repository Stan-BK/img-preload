export type ImgPoolType = HTMLImageElement | SVGImageElement

export const images: ImgPoolType[] = []
export const loadedImages: ImgPoolType[] = []
export const failedImages: ImgPoolType[] = []

export function initPool(imgs: ImgPoolType[]) {
  return images.splice(0, images.length, ...imgs)
}