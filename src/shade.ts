type ShadeStyles = Partial<Record<keyof CSSStyleDeclaration, string>>

class Shade {
  shade: HTMLElement
  lastPercent: number = 0
  lastTime: number = 0
  target: number = 0
  isHidden: boolean = false
  isCustom: boolean = false
  constructor(customShade?: HTMLElement) {
    this.shade = this.initShade(customShade)
  }

  initShade(customShade?: HTMLElement) {
    const shade = document.createElement('div')
    const { marginLeft, marginRight, marginTop, marginBottom } = getBodyMargin()
    const baseShadeStyle: ShadeStyles = {
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
      shade.appendChild(customShade)
    } else {
      this.render(0)
    }

    // add transition for hiding shade
    shade.addEventListener('transitionend', () => {
      this.isHidden && (this.shade.style.display = 'none')
    })

    document.body.appendChild(shade)

    return shade
  }

  render(per: number) {
    if (this.isCustom) return
    this.target = per
    requestAnimationFrame(this.renderShade.bind(this))
  }

  private renderShade(time: number = 0) {
    const per = this.lastPercent
    if (per >= 100 || per === this.target) return

    if (time - this.lastTime > 40) {
      this.lastTime = time
      this.shade.style.background = `linear-gradient(to right,  #666 ${50 - per / 2}%, white , #666 ${50 + per / 2}%)`
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