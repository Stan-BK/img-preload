import { default as ImgEventHandler, NOOP } from "./event"
import { default as Shade, ShadeOptions } from './shade'
import { initPool } from "./pool"
import type { ImgPoolType } from "./pool"
import { lazyLoad } from "./lazyLoad"

export interface ImgCallback {
  onLoad(currentLoadedImg: HTMLImageElement | SVGImageElement): any
  onError(currentErrorImg: HTMLImageElement | SVGImageElement): any
  onFinish(loadedImgs: ImgPoolType[], failedImgs: ImgPoolType[]): any
}

interface ImgPreloadOptions {
  images?: ImgPoolType[]
  isLazy?: boolean
  lazySrcAttr?: string
  onLoad?: ImgCallback["onLoad"]
  onError?: ImgCallback["onError"]
  onFinish?: ImgCallback["onFinish"]
  customShade?: ShadeOptions["customShade"]
  customColor?: ShadeOptions["customColor"]
}

class ImgPreload extends ImgEventHandler {
  readonly isLazy: boolean
  readonly lazySrcAttr: string
  readonly images: ImgPoolType[] // collection of images
  readonly shade: Shade // shade for covering page while images are loading
  readonly onLoad: ImgCallback["onLoad"]
  readonly onError: ImgCallback["onError"]
  readonly onFinish: ImgCallback["onFinish"]

  currentLoadImg: HTMLImageElement | SVGImageElement | undefined // the image has loaded or failed
  progress: number = 0 // the progress of images loading
  protected loadedCount: number = 0

  constructor({
    images,
    isLazy = false,
    lazySrcAttr = 'data-src',
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

    this.images = initPool(Array.isArray(images) ? images : [...Array.from(document.images), ...Array.from(document.querySelectorAll('image'))])
    this.isLazy = isLazy
    this.onLoad = onLoad
    this.onError = onError
    this.onFinish = onFinish
    this.lazySrcAttr = lazySrcAttr
    this.shade = new Shade({
      customShade,
      customColor
    })

    this.init()
  }

  private init() {
    lazyLoad(this.isLazy, this.lazySrcAttr)
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
      this.handleImgLoadFailed(img)
    }
  }

}

export default ImgPreload