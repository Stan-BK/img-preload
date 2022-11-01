type Styles = Partial<Record<keyof CSSStyleDeclaration, string>>
type customColor = string | string[]

interface ShadeOptions { 
  customShade?: HTMLElement, 
  customColor?: customColor 
}

class Shade {
  shade: HTMLElement
  private lastPercent: number = 0
  private lastTime: number = 0
  private target: number = 0
  private isHidden: boolean = false
  private isCustom: boolean = false
  private percentSign: HTMLElement = document.createElement('span')
  constructor(shadeOptions: ShadeOptions = {}) {
    const { customShade, customColor } = shadeOptions
    this.shade = this.initShade(customShade, customColor)
  }

  private initShade(customShade?: HTMLElement, customColor?: customColor) {
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
      transition: 'opacity .4s'
    }
    
    // first render shade
    for (let [key, value] of Object.entries(baseShadeStyle)) {
      // @ts-expect-error
      shade.style[key] = value
    }

    if (customShade) {
      if ( !(customShade instanceof HTMLElement) ) {
        throw new Error(`customShade expect a HTML element, but got a ${customShade}`)
      }
      
      this.isCustom = true

      this.percentSign.remove()
      shade.appendChild(customShade)
    } else {
      this.renderDefaultStyle(customColor)

      shade.appendChild(this.percentSign)
      this.render(100)
    }

    // add transition for hiding shade
    shade.addEventListener('transitionend', () => {
      this.isHidden && (this.shade.style.display = 'none')
    })

    document.body.appendChild(shade)

    return shade
  }

  renderDefaultStyle(customColor?: customColor) {
    const LGBTQIA_style = 'linear-gradient(135deg, red, orange, yellow, green, blue, purple, red, orange, yellow, green, blue, purple, red)'
    const bgc = customColor ? `linear-gradient(135deg, ${customColor.toString()})` : LGBTQIA_style
    
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
    if (this.isCustom) return
    this.target = per
    requestAnimationFrame(this.renderShade.bind(this))
  }

  private renderShade(time: number = 0) {
    const per = this.lastPercent
    if (per > 100 || per > this.target) return
    if (time - this.lastTime > 20) {
      this.lastTime = time
      this.percentSign.innerHTML = `${per}%`
    }
    
    this.lastPercent = per + 1
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