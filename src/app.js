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

  // reset
  modal.select('.party').removeClass('live')
  modal.select('.party').removeClass('night')
  modal.select('.party').removeClass('playground')
  modal.select('.youtube iframe').attr("src", "#")
  modal.select('.soundcloud iframe').attr("src", "#")

  // populate
  modal.select('.artist-name').html(artist.name)
  modal.select('.pic img').attr('src', `/assets/modale/${artist.pic}`)
  modal.select('.party').html(`Echap ${artist.party}`)
  modal.select('.party').addClass(artist.party)
  modal.select('.place p').html(artist.place)
  modal.select('.place span').html(artist.date)
  modal.select('.youtube iframe').attr("src", `https://www.youtube.com/embed/${artist.id_youtube}`)
  modal.select('.soundcloud iframe').attr("src", `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/${artist.id_soundcloud}&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true`)
  if(artist.label){
    modal.select('.description .head span:first-child').html(`${artist.location} – ${artist.label}`)  
  }else{
    modal.select('.description .head span:first-child').html(`${artist.location}`)
  }
  
  modal.select('.description .head span:last-child').html(artist.music_type)
  modal.select('.description p').html(artist.description)
  
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
          <p class="pic" style="background-image: url(/assets/artists/mono-${artist.pic})"></p>
          <p>${artist.name}</p>
        </li>
      `
    })

    artistsGalleryEl.innerHTML = html

    const lis = dom("#artists-gallery li")
    lis.map(addArtistClickEvent)
      
  })
  


})