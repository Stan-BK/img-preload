declare global {
  interface SVGImageElement {
    preloadLoadEventHandler: () => any
    preloadErrorEventHandler: () => any
  }

  interface HTMLImageElement {
    preloadLoadEventHandler: () => any
    preloadErrorEventHandler: () => any
  }
}

export { }