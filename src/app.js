import style from "./styles/stylesheet.sass"
import request from "superagent"
import dom from "domquery"
import {findArtist} from "./utils"


let artists = []

const toggleModal = function(el){
  dom(el).hasClass('hide') ? dom(el).removeClass('hide') : dom(el).addClass('hide')
}

const listenCloseModale = function(el){

  dom('#close-modale').on('click', function(){
    toggleModal(el)
  })

}

const populateModal = function(id){

  const artist = findArtist(artists, id)
  const modal = dom("#artist-modal")

  modal.select('.artist-name').textContent = artist.name
  toggleModal(modal)
  
}

const addArtistClickEvent = function(el){

  dom(el).on('click', function(){
    const id = dom(el).attr('data-id')

    populateModal(id)
    
  })
} 

document.addEventListener("DOMContentLoaded", function(event) { 
  
  // Add event to close modale
  listenCloseModale(dom("#artist-modal"))


  const artistsGalleryEl = document.getElementById("artists-gallery")

  request.get("/data/artists.json", function(err, response){
    if(err) return false

    let html = ""

    artists = response.body

    artists.forEach(function(artist){

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