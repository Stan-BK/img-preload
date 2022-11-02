import { default as ImgEventHandler, NOOP } from "./event"
import { default as Shade, ShadeOptions } from './shade'
// import type ShadeOptions from './shade'
interface ImgCallback {
  onLoad(currentLoadedImg: HTMLImageElement): any
  onError(currentErrorImg: HTMLImageElement): any
}

interface ImgPreloadOptions {
  onLoad: ImgCallback["onLoad"]
  onError: ImgCallback["onError"]
  customShade?: ShadeOptions["customShade"]
  customColor?: ShadeOptions["customColor"]
}

class ImgPreload extends ImgEventHandler {
  readonly images: ArrayLike<HTMLImageElement> // collection of images
  readonly shade: Shade // shade for covering page while images are loading
  readonly onLoad: ImgCallback["onLoad"]
  readonly onError: ImgCallback["onError"]
  
  currentLoadImg: HTMLImageElement | undefined // the image has loaded or failed
  progress: number = 0 // the progress of images loading
  protected loadedCount: number = 0

  constructor({
    onLoad = NOOP, 
    onError = NOOP,
    customShade,
    customColor
  }: ImgPreloadOptions = {
    onLoad: NOOP,
    onError: NOOP
  }) {

    super()

    if (!globalThis.document) {
      throw new Error('ImgPreload only access in browser.')
    }

    this.images = document.images
    this.onLoad = onLoad
    this.onError = onError
    this.shade = new Shade({
      customShade,
      customColor
    })
    
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