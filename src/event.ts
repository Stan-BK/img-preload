import type ImgPreload from "./model";

export const NOOP = () => {}

export default class ImgEventHandler {
  handleImgLoaded(this: ImgPreload , img: HTMLImageElement) {
    img.addEventListener('load', () => {
      this.onLoad(img)
      this.updateProgress()
    })
  }

  handleImgLoadFaild(this: ImgPreload, img: HTMLImageElement) {
    img.addEventListener('error', () => {
      this.onError(img)
      this.updateProgress()
    })
  }

  updateProgress(this: ImgPreload) {
    this.progress = ++this.loadedCount / this.images.length
  }
}