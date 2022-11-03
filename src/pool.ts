export const images: HTMLImageElement[] = []
export const loadedImages: HTMLImageElement[] = []
export const failedImages: HTMLImageElement[] = []

export function initPool(imgs: ArrayLike<HTMLImageElement>) {
  images.splice(0, images.length, ...Array.from(imgs))
}