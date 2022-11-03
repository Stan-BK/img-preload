import { default as ImgEventHandler, NOOP } from "./event"
import { default as Shade, ShadeOptions } from './shade'
import { initPool } from "./pool"
import { lazyLoad } from "./lazyLoad"

interface ImgCallback {
  onLoad(currentLoadedImg: HTMLImageElement): any
  onError(currentErrorImg: HTMLImageElement): any
  onFinish(loadedImgs: HTMLImageElement[], failedImgs: HTMLImageElement[]): any
}

interface ImgPreloadOptions {
  isLazy?: boolean
  onLoad?: ImgCallback["onLoad"]
  onError?: ImgCallback["onError"]
  onFinish?: ImgCallback["onFinish"]
  customShade?: ShadeOptions["customShade"]
  customColor?: ShadeOptions["customColor"]
}

class ImgPreload extends ImgEventHandler {
  readonly images: ArrayLike<HTMLImageElement> // collection of images
  readonly shade: Shade // shade for covering page while images are loading
  readonly isLazy: boolean
  readonly onLoad: ImgCallback["onLoad"]
  readonly onError: ImgCallback["onError"]
  readonly onFinish: ImgCallback["onFinish"]
  
  currentLoadImg: HTMLImageElement | undefined // the image has loaded or failed
  progress: number = 0 // the progress of images loading
  protected loadedCount: number = 0

  constructor({
    isLazy = false,
    onLoad = NOOP, 
    onError = NOOP,
    onFinish = NOOP,
    customShade,
    customColor
  }: ImgPreloadOptions = {}) {

    super()

    if (!globalThis.document) {
      throw new Error('ImgPreload only access in browser.')
    }

    this.images = document.images
    this.isLazy = isLazy
    this.onLoad = onLoad
    this.onError = onError
    this.onFinish = onFinish
    this.shade = new Shade({
      customShade,
      customColor
    })

    this.init()
  }

  private init() {
    initPool(this.images)
    this.isLazy && lazyLoad()
    this.bindEvent()
  }

  // for showing shade
  show() {
    this.shade.show()
  }

  // for hiding shade
  hide() {
    this.shade.hide()
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