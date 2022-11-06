import type { default as ImgPreload, ImgCallback } from "./model";
import { images, loadedImages, failedImages } from "./pool";

export const NOOP = () => {}

export default class ImgEventHandler {
  handleImgLoaded(this: ImgPreload , img: HTMLImageElement) {
    const encodeUri = getParsedUri(this.lazySrcAttr, img)

    // img already loaded and will not be reload
    if (img.complete && encodeUri === img.src) {
      this.onLoad(img)
      loadedImages.push(img)
      this.updateProgress(img)
      return
    }

    img.addEventListener('load', this.handler.bind(this, 'load', this.onLoad, img))
  }

  handleImgLoadFaild(this: ImgPreload, img: HTMLImageElement) {
    const encodeUri = getParsedUri(this.lazySrcAttr, img)

    // img already loaded and will not be reload
    if (img.complete && encodeUri === img.src) {
      return
    }

    img.addEventListener('error', this.handler.bind(this, 'error', this.onError, img))
  }

  handleImgAllSettle(this: ImgPreload) {
    this.onFinish(loadedImages, failedImages)
  }

  updateProgress(this: ImgPreload, loadImg: HTMLImageElement) {
    this.currentLoadImg = loadImg
    this.progress = ++this.loadedCount / images.length
    this.shade.render(this.progress * 100)
    
    if (images.length === loadedImages.length + failedImages.length) {
      this.handleImgAllSettle()
    }
  }

  private handler(this: ImgPreload, type: 'load' | 'error', callback: ImgCallback["onLoad"] | ImgCallback["onError"], img: HTMLImageElement) {
    const encodeUri = getParsedUri(this.lazySrcAttr, img)
    
    if (this.isLazy && encodeUri !== img.src) {
      return
    }

    type === 'load' ? loadedImages.push(img) : failedImages.push(img)
    callback(img)
    this.updateProgress(img)
  }

}

function getParsedUri(srcAttr: string, img: HTMLImageElement) {
  const uri = img.getAttribute(srcAttr)!
  return encodeURI(uri) === 'null' ? img.src : encodeURI(uri)  
}