const API_KEY = '37361375'
const body = document.querySelector("body")
const form = document.querySelector("form")
const search = document.querySelector("#search")
const resultsDisplay = document.querySelector("#results")
let filmTitle = ""
let filmList = []
let resultsPageCount = 0

form.addEventListener("submit", (e) => {
  e.preventDefault()
  filmTitle = search.value
  getMovieDetails(filmTitle)
})

async function getMovieDetails(searchedFilmTitle) {
  resultsDisplay.innerHTML = ''
  let response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchedFilmTitle}`)
  let myJson = await response.json()
  resultsPageCount = Math.ceil(myJson.totalResults / 10)

  for (let i = 1; i <= resultsPageCount; i++) {
    response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchedFilmTitle}&page=${i}`)
    console.log("numéro de page :", i)
    myJson = await response.json()
    filmList = myJson.Search

    // console.log("voici l'array en train de s'afficher :", filmList)
    filmList.forEach(movie => {
      resultsDisplay.innerHTML += `
      <div class="movie_box">
        <h1>${movie.Title} <span>(${movie.Year})</span></h1>
        <img src=${movie.Poster !== "N/A" ? movie.Poster : "https://fixiedesign.com/images/stories/virtuemart/product/v%C3%A9lo-urbain-ps1-chrome.png"}>
        <button data-movie = "${movie.imdbID}">Plus de détails</button>
      </div>
      `
    })
  }
}


resultsDisplay.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    console.log(e.target.dataset.movie)
  }
})
