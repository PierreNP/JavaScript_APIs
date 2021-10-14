const KEY = config.apikey

console.log(KEY)
const body = document.querySelector("body")
const form = document.querySelector("form")
const search = document.querySelector("#search")
const modal = document.querySelector('.modal');
const modalContent = document.querySelector(".modal-content")
const close = document.querySelector("#close")
const overlay = document.querySelector('.overlay');

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
    openModal()
    getMovieDetails(e.target.dataset.movie)
  }
})

async function getMovieDetails(id) {
  let detailedResponse = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}&plot=full`)
  let myDetailedJson = await detailedResponse.json()
  modalContent.innerHTML = `<p>${myDetailedJson.Plot}</p>`
}

function openModal() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  modalContent.innerHTML = ``
};


close.addEventListener('click', closeModal)
overlay.addEventListener("click", closeModal)

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    closeModal()
})
