import axios from "axios";

const TMDB = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
});

const getMoviesByTerm = (SearchTerm, setMovies, page_no, setTotalPages) => {
  TMDB.get("/search/movie/", {
    params: {
      api_key: "058528d75d39a5410d65a94f4b9718ab",
      query: SearchTerm,
      page: page_no,

    },
  }).then((response) => {
    //see the objects of the response response 
    console.log(response.data);
    setMovies(response.data.results);
    setTotalPages(response.data.total_pages);
  });
};

const getMovieDetails = (movieID,setCurrentMovie) => {
  TMDB.get("movie/"+movieID, {
    params: {
      api_key: "058528d75d39a5410d65a94f4b9718ab",

    },
  }).then((response) => {
    //see the objects of the response response 
    console.log(response.data);
    setCurrentMovie(response.data);
  });
};

export { getMoviesByTerm,getMovieDetails };