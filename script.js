const KEY = config.apikey

console.log(KEY)
const body = document.querySelector("body")
const form = document.querySelector("form")
const search = document.querySelector("#search")
const popup = document.querySelector("#pop-up")
const popupContainer = document.querySelector("#popup-container")
const popupContent = document.querySelector(".popup-content")
const close = document.querySelector("#close")

const resultsDisplay = document.querySelector("#results")
let filmTitle = ""
let filmList = []
let resultsPageCount = 0

form.addEventListener("submit", (e) => {
  e.preventDefault()
  filmTitle = search.value
  getMovies(filmTitle)
})

async function getMovies(searchedFilmTitle) {
  resultsDisplay.innerHTML = ''
  let response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${searchedFilmTitle}`)
  let myJson = await response.json()
  resultsPageCount = Math.ceil(myJson.totalResults / 10)

  for (let i = 1; i <= resultsPageCount; i++) {

    response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${searchedFilmTitle}&page=${i}&plot=full`)
    myJson = await response.json()
    filmList = myJson.Search

    filmList.forEach(movie => {
      resultsDisplay.innerHTML += `
      <div class="movie_box">
        <h1>${movie.Title} <span>(${movie.Year})</span></h1>
        <img class="lzy_img" src="lazy.png" data-src=${movie.Poster !== "N/A" ? movie.Poster : "https://fixiedesign.com/images/stories/virtuemart/product/v%C3%A9lo-urbain-ps1-chrome.png"}>
        <button data-movie = "${movie.imdbID}">Plus de détails</button>
      </div>
      <div class="hidden" id="details">detail : ${movie.imdbID}</div>
      `

      const imageObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target
            lazyImage.src = lazyImage.dataset.src
          }
        })
      })

      const arr = document.querySelectorAll('img.lzy_img')
      arr.forEach((v) => {
        imageObserver.observe(v)
      })

    })
  }


}


resultsDisplay.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    showPopup()
    getMovieDetails(e.target.dataset.movie)
  }
})

async function getMovieDetails(id) {
  let detailedResponse = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}&plot=full`)
  let myDetailedJson = await detailedResponse.json()
  popupContent.innerHTML = `<p><b>Résumé (attention spoiler !) : </b><br><br>${myDetailedJson.Plot}</p>`
}


function showPopup() {
  popupContainer.style.display = "block"
}

function hidePopup() {
  popupContainer.style.display = "none"
  popupContent.innerHTML = ``

}

close.addEventListener('click', hidePopup)

body.addEventListener("click", (e) => {
  if (e.target === popupContainer)
    hidePopup()
})

body.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    hidePopup()
})

