import ImgPreload from "./model";

export const NOOP = () => {}

export default class ImgEventHandler {
  handleImgLoaded(this: ImgPreload , img: HTMLImageElement) {
    img.addEventListener('load', () => {
      this.onLoad(img)
    })
  }

  handleImgLoadFaild(this: ImgPreload, img: HTMLImageElement) {
    img.addEventListener('error', () => {
      this.onError(img)
    })
  }
}