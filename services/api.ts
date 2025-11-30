export const TMDB_CONFIG = {
    BASE_URL: "https://api.themoviedb.org/3",
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY} `
    }
}

export const fetchMovies = async ({query}: {query: string} ) =>{
const endpoint = query
? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
: `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.dsc`


const res = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers
})

if (!res.ok){
    throw new Error("failed to fetch the movies this time")
}

const data = await res.json()
return data.results



}

// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTU5YTE1ZTZiOTA5YWNmYzI4ZTUzZTI3MDBiYThkZSIsIm5iZiI6MTc2NDA5MDI3Ny4xMDcsInN1YiI6IjY5MjVlMWE1OGIyYjcxNjM2YTI2YmFmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rjuwOuAuxGPKKI0i4RTC2Fiogun8h4RdlHEnaQaMxwE'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));

