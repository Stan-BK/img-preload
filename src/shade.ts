type Styles = Partial<Record<keyof CSSStyleDeclaration, string>>
type CustomColor = string | string[] | undefined
type CustomShade = undefined | HTMLElement | ((percent: number, options: {
  shade: HTMLElement
  show: Shade["show"]
  hide: Shade["hide"]
}) => any)

export interface ShadeOptions {
  customShade?: CustomShade,
  customColor?: CustomColor
}

class Shade {
  shade: HTMLElement
  private lastPercent = 0
  private lastTime = 0
  private lastRenderPercent = 0
  private target = 0
  private isHidden = false
  private isCustom = false
  private percentSign: HTMLElement = document.createElement('span')
  private customShade: CustomShade
  private customColor: CustomColor
  private animationFrame: number = 0
  constructor(shadeOptions: ShadeOptions = {}) {
    const { customShade, customColor } = shadeOptions
    this.customShade = customShade
    this.customColor = customColor
    this.shade = this.initShade()
  }

  private initShade() {
    const customShade = this.customShade
    const customColor = this.customColor
    const shade = document.createElement('div')

    const { marginLeft, marginRight, marginTop, marginBottom } = getBodyMargin()
    const baseShadeStyle: Styles = {
      position: 'fixed',
      left: `-${marginLeft}px`,
      top: `-${marginTop}px`,
      width: `calc(100vw + ${marginLeft + marginRight}px)`,
      height: `calc(100vh + ${marginTop + marginBottom}px)`,
      backgroundColor: '#F3F3F3',
      opacity: '1',
      transition: 'opacity .4s',
      zIndex: '99999'
    }

    // first render shade
    for (let [key, value] of Object.entries(baseShadeStyle)) {
      // @ts-expect-error
      shade.style[key] = value
    }

    if (customShade) {
      const isFunc = typeof customShade === 'function'
      if (!(customShade instanceof HTMLElement) && !isFunc) {
        throw new Error(`customShade expect a HTML element or a function, but got a ${customShade}`)
      }

      this.isCustom = true

      if (isFunc) {
        customShade(0, {
          shade,
          show: this.show,
          hide: this.hide
        })
      } else {
        shade.appendChild(customShade)
      }

      this.percentSign.remove() // clear it since never use
    } else {
      this.renderDefaultStyle(customColor)

      shade.appendChild(this.percentSign)
    }

    // add transition for hiding shade
    shade.addEventListener('transitionend', () => {
      this.isHidden && (this.shade.style.display = 'none')
    })

    document.body.appendChild(shade)

    return shade
  }

  renderDefaultStyle(customColor?: CustomColor) {
    const LGBTQIA_style = 'linear-gradient(135deg, red, orange, yellow, green, blue, purple, red, orange, yellow, green, blue, purple, red)'
    const bgc = customColor ? Array.isArray(customColor) ? `linear-gradient(135deg, ${customColor.length === 1 ? customColor[0] + ',' + customColor[0] : customColor.toString()})`
      : `linear-gradient(135deg, ${customColor}, ${customColor})`
      : LGBTQIA_style

    const percentSignStyle: Styles = {
      position: 'fixed',
      left: '50vw',
      top: ' 50vh',
      fontSize: '94px',
      fontWeight: 'bold',
      background: bgc,
      backgroundClip: 'text',
      webkitBackgroundClip: 'text',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '200% 200%',
      color: 'rgb(0, 0, 0, .2)',
      transform: 'translate(-50%, -50%)',
      lineHeight: '100%',
      animation: 'animateBg infinite linear 2s',
      fontFamily: 'sans-serif'
    }
    // render default shade style that with a percent-count
    for (let [key, value] of Object.entries(percentSignStyle)) {
      // @ts-expect-error
      this.percentSign.style[key] = value
    }

    this.percentSign.innerHTML = `0%`
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet)
    styleSheet.sheet?.insertRule(`
      @keyframes animateBg {
        from {
          background-position: 0% 0%;
        }
        to {
          background-position: 100% 100%;
        }
      }
    `)
  }

  render(per: number) {
    if (this.isCustom) {
      const customShade = this.customShade
      typeof customShade === 'function' && customShade(per, {
        shade: this.shade,
        show: this.show,
        hide: this.hide
      })
      return
    }
    this.target = per
    cancelAnimationFrame(this.animationFrame)
    this.animationFrame = requestAnimationFrame(this.renderShade.bind(this))
  }

  private renderShade(time: number = 0) {
    this.lastPercent < this.target && (this.lastPercent++)
    const per = this.lastPercent
    if (per === this.lastRenderPercent) return
    if (time - this.lastTime > 20) {
      this.lastTime = time
      this.percentSign.innerHTML = `${this.lastRenderPercent = per}%`
      this.shade.style.background = `linear-gradient(to right, #ccc, transparent ${50 - per / 2}%),
                                     linear-gradient(to left, #ccc, transparent ${50 - per / 2}%),
                                     linear-gradient(#f3f3f3, #f3f3f3)`

      if (per === 100) {
        setTimeout(() => this.hide(), 500)
        return
      }
    }

    requestAnimationFrame(this.renderShade.bind(this))
  }

  show() {
    this.shade.style.display = 'block'
    this.isHidden = false
    this.shade.style.opacity = '1'
  }

  hide() {
    // when the transition of opacity is end, shade will be hidden
    this.shade.style.opacity = '0'
    this.isHidden = true
  }

  reload() {
    if (this.percentSign) this.percentSign.innerHTML = '0%'
    this.lastPercent = 0
    this.lastTime = 0
    this.lastRenderPercent = 0
    this.target = 0
    this.isHidden = false
    this.show()
  }
}

function getBodyMargin() {
  const {
    marginLeft,
    marginTop,
    marginRight,
    marginBottom
  } = getComputedStyle(document.body)

  return {
    marginLeft: parseInt(marginLeft),
    marginTop: parseInt(marginTop),
    marginRight: parseInt(marginRight),
    marginBottom: parseInt(marginBottom)
  }
}

export default Shade