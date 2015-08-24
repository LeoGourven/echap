import style from "./styles/stylesheet.sass"
import request from "superagent"
import dom from "domquery"
import scrollTo from "animated-scrollto"
import scrollBounds from "scroll-bounds"
import scale from "d3-scale"
import {findArtist, getOffsetRectTop} from "./utils"


;(function() {
    var throttle = function(type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle ("scroll", "optimizedScroll");
})();


let artists = []

const addRainbow = function(){

  const colors = ["red", "green", 'pink']

  dom('.rainbow')
    .on('mouseenter', function(){

      const key = Math.floor(Math.random() * colors.length)

      dom(this).style('color', colors[key])
    })
    .on('mouseleave', function(){
      dom(this).style('color', 'initial')
    })
    
}


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



  modal.select('.pic').attr('style', `background-image: url(/assets/modale/${artist.pic})`)
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

const toggleGrid = function(){

  dom(window).onKey('g', function(k){
      dom(".grid").toggleClass('hidden')
  })
}




document.addEventListener("DOMContentLoaded", function(event) { 
    
  // Add event to close modales
  listenCloseModale(dom(".modal-container"))
  // Add open modal events
  attachOpenModalEvents()
  // Add menu events
  attachMenuEvents()
  // Add grid manager
  toggleGrid()
  // add rainbow effet
  addRainbow()

  // Parallax struff
  const illustration = dom("#illustration")
  const illustrationPos = getOffsetRectTop(illustration[0])
  // DOC : domain(startEffectPosition, endEffectPosition).range(minBackgroundposition, maxBackgroundposition)
  const illuScale = scale.linear().domain([illustrationPos-600, illustrationPos+400]).range([55, 95]).clamp(true)

  window.addEventListener("optimizedScroll", function(e) {
      const pos = document.body.scrollTop
      illustration.style('background-position-y', `${illuScale(pos)}%`)
  });

  const sb = scrollBounds(document.body)
  sb.on('top', function(){
    dom('menu').removeClass('collapsed')
  })

  sb.on('break', function (boundary) {
    if(boundary==="top"){
      dom('menu').addClass('collapsed')
    }
  });



  const artistsGalleryEl = document.getElementById("artists-gallery")

  request.get("/data/artists.json", function(err, response){
    if(err) return false

    let html = ""

    artists = response.body

    artists.forEach(function(artist){

      html += `
        <li class="${artist.party}" data-id="${artist.id}">
          <div class="pic--wrapper">
            <div class="pic" style="background-image: url(/assets/artists/mono-${artist.pic})"></div>
          </div>
          <p class="artist-name">${artist.name}</p>
        </li>
      `
    })

    artistsGalleryEl.innerHTML = html

    const lis = dom("#artists-gallery li")
    lis.map(addArtistClickEvent)

    dom(".party-lineup li").map(addArtistClickEvent)
      
  })
  


})