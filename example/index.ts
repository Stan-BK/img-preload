import ImgPreload from '../src/index'
const list = []
const loadedList = document.getElementsByClassName('loaded-list')[0]
const imageNameReg = /(.*?).jpg/

new ImgPreload({
  isLazy: true,
  lazySrcAttr: 'data-src',
  onLoad(img) {
    if (!img.className.includes('bg')) {
      const uri = decodeURI(img.src)
      const name = uri.split('/').reverse()[0].match(imageNameReg)![1]
      addList(name)
    }
  }
})

function addList(content: string) {
  const li = document.createElement('li')
  li.innerHTML = content
  li.addEventListener('click', () => {
    location.hash = content
  })
  loadedList.appendChild(li)
}
