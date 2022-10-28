import { default as ImgEventHandler, NOOP } from "./event"

export interface ImgCallback {
  onLoad(currentLoadedImg: HTMLImageElement): any
  onError(currentErrorImg: HTMLImageElement): any
}

class ImgPreload extends ImgEventHandler {
  readonly images: ArrayLike<HTMLImageElement> // collection of images
  readonly shade: HTMLElement // shade for covering page while images are loading
  readonly currentLoadingImg: HTMLImageElement // the image being loading
  readonly onLoad: ImgCallback["onLoad"]
  readonly onError: ImgCallback["onError"]
  progress: number = 0 // the progress of images loading
  protected loadedCount: number = 0

  constructor(onLoad: ImgCallback["onLoad"] = NOOP, onError: ImgCallback["onError"] = NOOP) {

    super()

    if (!globalThis.document) {
      throw new Error('ImgPreload only access in browser.')
    }

    this.images = document.images
    this.shade = document.createElement('div')
    this.currentLoadingImg = this.images[0]
    this.onLoad = onLoad
    this.onError = onError
    
    this.bindEvent()
  }

  // for showing shade
  show() {
    this.shade.style.display = 'none'
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