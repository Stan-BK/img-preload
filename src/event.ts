import type ImgPreload from "./model";
import { loadedImages, failedImages } from "./pool";

export const NOOP = () => {}

export default class ImgEventHandler {
  handleImgLoaded(this: ImgPreload , img: HTMLImageElement) {
    const handler = () => {
      loadedImages.push(img)
      this.onLoad(img)
      this.updateProgress(img)
      
      if (this.images.length === loadedImages.length + failedImages.length) {
        this.handleImgAllSettle()
      }
    }

    if (img.complete) {
      handler()
      return
    }

    img.addEventListener('load', handler)
  }

  handleImgLoadFaild(this: ImgPreload, img: HTMLImageElement) {
    const handler = () => {
      failedImages.push(img)
      this.onError(img)
      this.updateProgress(img)
      
      if (this.images.length === loadedImages.length + failedImages.length) {
        this.handleImgAllSettle()
      }
    }

    if (img.complete) {
      handler()
      return
    }

    img.addEventListener('error', handler)
  }

  handleImgAllSettle(this: ImgPreload) {
    this.onFinish(loadedImages, failedImages)
  }

  updateProgress(this: ImgPreload, loadImg: HTMLImageElement) {
    this.currentLoadImg = loadImg
    this.progress = ++this.loadedCount / this.images.length
    this.shade.render(this.progress * 100)
  }

}