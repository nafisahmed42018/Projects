import React from "react";
import Movie from "./Movie";

const MovieList = ({movies}) => {
  console.log(movies);
  return (
    <div className="container">
      <div className="row">
        <div className="col s12">
          { movies.map((movie, id) => {
            return (<Movie data={movie} key={id} />);
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieList;