import React, { useState } from "react";
//import { BrowserRouter, Link, Route} from "react-router-dom";
import Searchbar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Pagination from "./components/Pagination";
import { getMoviesByTerm } from "./api/TMDB";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await getMoviesByTerm(searchTerm, setMovies, currentPage, setTotalPage);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const nextPage = async(page_number) => {
    setCurrentPage(page_number);
    await getMoviesByTerm(searchTerm,setMovies,currentPage,setTotalPage)
  }

  return (
    <div>

        <Searchbar handleChange={handleChange} handleSubmit={handleSubmit} />
        <MovieList movies={movies} />
        {totalPage > 1 ? (<Pagination
          nextPage={nextPage}
          currentPage={currentPage}
          totalPage={totalPage}/>) : ("")}

    </div>
  );
};

export default App;