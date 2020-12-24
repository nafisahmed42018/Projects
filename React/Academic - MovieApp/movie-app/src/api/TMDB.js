import axios from "axios";

const TMDB = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
});

const getMoviesByTerm = (SearchTerm, setMovies) => {
  TMDB.get("/search/movie/", {
    params: {
      api_key: "058528d75d39a5410d65a94f4b9718ab",
      query: SearchTerm,
    },
  }).then((response) => {
    console.log(response.data);
    setMovies(response.data.results);
  });
};

export { getMoviesByTerm };