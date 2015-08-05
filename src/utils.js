export function findArtist(collection, predicate) {

  let selection = null

  collection.map(function(item){
    if(item.id === predicate){
      selection = item
    }
  })

  return selection
}