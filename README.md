# Img Preload
An scheme for imgs loading scheme while page rendering.
# U can use it to
1. handle all images loading progress which are in the first page
2. use lazyload to speed up imgs-loading and page-rendering
3. custom styles of shade when its waiting for images loading

# U can use it by

```
pnpm i @stan_bk/img-preload
```

```
import ImgPreload from '@stan_bk/img-preload'

new ImgPreload({
  isLazy: true, // if enable lazyload
  lazySrcAttr: 'data-src', // src attribute name to access
  customShade: document.createElement('div'), // custom shade, expect a document element or function
  customColor: ['green', 'yellow 80%'], // custom color for rendering default shade(which style with linear-gradient)
  onLoad(img) {
    // handle image just loaded
  },
  onError(img) {
    // handle image just loaded with error
  },
  onFinish(loadedImages, failedImages) {
    // handle all images loaded or failed
  }
})
```
# Sth you should know
1. Img Preload only run in browser cause it need access document
2. When lazyload option is enabled, 
- you are expect to pass img source path to attribute which named by the value of `lazySrcAttr` instead `src`
- the source path will reload with `lazySrcAttr` if it has both `lazySrcAttr` and `src` attribute
- the finish event will trigger if the images in view had been loaded
3. When customShade is provided, it will instead
of default shade, you can access the shade container and the controllers of it through customShade function