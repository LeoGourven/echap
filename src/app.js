import style from "./styles/stylesheet.sass"
import request from "superagent"
import dom from "domquery"


const addArtistClickEvent = function(el){

  dom(el).on('click', function(){
    const id = dom(el).attr('data-id')
    console.log(id)
  })  
} 



document.addEventListener("DOMContentLoaded", function(event) { 
  
  const artistsGalleryEl = document.getElementById("artists-gallery")

  request.get("/data/artists.json", function(err, response){
    if(err) return false

    let html = ""

    response.body.forEach(function(artist){

      html += `
        <li class="${artist.party}" data-id="${artist.id}">
          <p class="pic" style="background-image: url(/assets/artists/${artist.pic})"></p>
          <p>${artist.name}</p>
        </li>
      `
    })

    artistsGalleryEl.innerHTML = html

    const lis = dom("#artists-gallery li")
    lis.map(addArtistClickEvent)
      
  })
  


})