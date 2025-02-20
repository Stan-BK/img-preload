import type { default as ImgPreload, ImgCallback } from "./model";
import { images, loadedImages, failedImages } from "./pool";
import type { ImgPoolType } from "./pool";
export const NOOP = () => { }

export default class ImgEventHandler {
  handleImgLoaded(this: ImgPreload, img: ImgPoolType) {
    img.setAttribute('is-handle-load', 'true')

    if (img instanceof SVGImageElement) {
      img.setAttribute('xlink:href', img.href.baseVal)
    } else {
      const encodeUri = getParsedUri(this.lazySrcAttr, img)

      // img already loaded and will not be reload
      if (img.complete && encodeUri === img.src) {
        this.onLoad(img)
        loadedImages.push(img)
        this.updateProgress(img)
        return
      }
    }

    const handler = this.handler.bind(this, 'load', this.onLoad, img)
    img.addEventListener('load', handler)
    img.preloadLoadEventHandler = handler
  }

  handleImgLoadFailed(this: ImgPreload, img: HTMLImageElement | SVGImageElement) {
    if (!(img instanceof SVGImageElement)) {
      const encodeUri = getParsedUri(this.lazySrcAttr, img)

      // img already loaded and will not be reload
      if (img.complete && encodeUri === img.src) {
        return
      }
    }

    const handler = this.handler.bind(this, 'error', this.onError, img)
    img.addEventListener('error', handler)
    img.preloadErrorEventHandler = handler
  }

  handleImgAllSettle(this: ImgPreload) {
    this.onFinish(loadedImages, failedImages)
  }

  updateProgress(this: ImgPreload, loadImg: HTMLImageElement | SVGImageElement) {
    this.currentLoadImg = loadImg
    if (++this.loadedCount > images.length) return

    this.progress = this.loadedCount / images.length
    this.shade.render(this.progress * 100)

    if (images.length === this.loadedCount) {
      this.handleImgAllSettle()
    }
  }

  private handler(this: ImgPreload, type: 'load' | 'error', callback: ImgCallback["onLoad"] | ImgCallback["onError"], img: HTMLImageElement | SVGImageElement) {
    if (!(img instanceof SVGImageElement)) {
      const encodeUri = getParsedUri(this.lazySrcAttr, img)

      if (this.isLazy && encodeUri !== img.src) {
        return
      }
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