import style from "./styles/stylesheet.sass"
import request from "superagent"
import dom from "domquery"
import scrollTo from "animated-scrollto"

import {findArtist, getOffsetRectTop} from "./utils"


let artists = []

const attachOpenModalEvents = function(){

  dom(".button-place-modal").on("click", function(e){
    e.preventDefault()
    toggleModal(dom(`.modal-place.${dom(this).attr('data-id')}`))
  })

}

const attachMenuEvents = function(){

  dom("menu li").on('click', function(){
    const anchor = dom(this).attr('data-class')
    if(anchor){

      const yPos = getOffsetRectTop(dom(`.${anchor}`)[0])

      scrollTo(
        document.body, 
        yPos, 
        600, 
        function() {} // calback
      );

    }

  })

}

const toggleModal = function(el){
  dom(el).hasClass('hide') ? dom(el).removeClass('hide') : dom(el).addClass('hide')
}

const listenCloseModale = function(elements){
    
    dom(elements).forEach(function(el){
      // self invocating function
      // to keep track of the modale we wan to close
      (function(el){
        dom(el).select('.close-modale').on('click', function(){
          toggleModal(el)
        })  
      })(el)
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


  if(artist.id_youtube){
    modal.select('.youtube').show()
    modal.select('.youtube iframe').attr("src", `https://www.youtube.com/embed/${artist.id_youtube}`)  
  }else{
    modal.select('.youtube').hide()
  }

  if(artist.id_soundcloud){
    modal.select('.soundcloud').show()
    modal.select('.soundcloud iframe').attr("src", `https://w.soundcloud.com/player/?url=${artist.id_soundcloud}&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true`)  
  }else{
    modal.select('.soundcloud').hide()
  }

  if(artist.id_mixcloud){
    modal.select('.mixcloud').show()
    modal.select('.mixcloud iframe').attr("src", artist.id_mixcloud)  
  }else{
    modal.select('.mixcloud').hide()
  }



  if(artist.soundcloud){
    modal.select('.buttons .sc').style("display", "block")
    modal.select('.buttons .sc a').attr("href", `https://soundcloud.com/${artist.soundcloud}`)
  }else{
    modal.select('.buttons .sc').style("display", "none")
  }

  if(artist.facebook){
    modal.select('.buttons .fb').style("display", "block")
    modal.select('.buttons .fb a').attr("href", `https://facebook.com/${artist.facebook}`)
  }else{
    modal.select('.buttons .fb').style("display", "none")
  }
  

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
  
  // Add event to close modales
  listenCloseModale(dom(".modal-container"))

  // Add open modal events
  attachOpenModalEvents()

  // Add menu events
  attachMenuEvents()


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