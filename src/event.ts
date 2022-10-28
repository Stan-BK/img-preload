import type ImgPreload from "./model";

export const NOOP = () => {}

export default class ImgEventHandler {
  handleImgLoaded(this: ImgPreload , img: HTMLImageElement) {
    img.addEventListener('load', () => {
      this.onLoad(img)
      this.updateProgress(img)
    })
  }

  handleImgLoadFaild(this: ImgPreload, img: HTMLImageElement) {
    img.addEventListener('error', () => {
      this.onError(img)
      this.updateProgress(img)
    })
  }

  updateProgress(this: ImgPreload, loadImg: HTMLImageElement) {
    this.currentLoadImg = loadImg
    this.progress = ++this.loadedCount / this.images.length
  }
}