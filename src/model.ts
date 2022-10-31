import { default as ImgEventHandler, NOOP } from "./event"
import Shade from './shade'

export interface ImgCallback {
  onLoad(currentLoadedImg: HTMLImageElement): any
  onError(currentErrorImg: HTMLImageElement): any
}

class ImgPreload extends ImgEventHandler {
  readonly images: ArrayLike<HTMLImageElement> // collection of images
  readonly shade: Shade // shade for covering page while images are loading
  readonly onLoad: ImgCallback["onLoad"]
  readonly onError: ImgCallback["onError"]
  
  currentLoadImg: HTMLImageElement | undefined // the image has loaded or failed
  progress: number = 0 // the progress of images loading
  protected loadedCount: number = 0

  constructor(onLoad: ImgCallback["onLoad"] = NOOP, onError: ImgCallback["onError"] = NOOP) {

    super()

    if (!globalThis.document) {
      throw new Error('ImgPreload only access in browser.')
    }

    this.images = document.images
    this.onLoad = onLoad
    this.onError = onError
    this.shade = new Shade()
    
    this.bindEvent()
  }

  // for showing shade
  show() {
    
  }

  // for hiding shade
  hide() {

  }

  bindEvent() {
    const images = this.images
    for (let i = 0; i < images.length; i++) {
      const img = images[i]

      this.handleImgLoaded(img)
      this.handleImgLoadFaild(img)
    }
  }

}

export default ImgPreload