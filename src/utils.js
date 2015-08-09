export function findArtist(collection, predicate) {

  let selection = null

  collection.map(function(item){
    if(item.id === predicate){
      selection = item
    }
  })

  return selection
}

export function getOffsetRectTop(elem) {
    const box = elem.getBoundingClientRect()
    const body = document.body
    const docElem = document.documentElement
    const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    const clientTop = docElem.clientTop || body.clientTop || 0
    const top  = box.top +  scrollTop - clientTop
    return Math.round(top)
}
