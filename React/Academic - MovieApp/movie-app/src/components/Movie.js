import React from "react";
import {Link} from 'react-router-dom'


const Movie = ({data})=> {
  const ImageURL = "https://image.tmdb.org/t/p/w500/" + data.poster_path;
  return (
    <div className="col s12 m4 center-align">
      <div className="card" >
        <div className="card-image">
          {data.poster_path == null ? (
            <img
              src="https://picsum.photos/200/300"
              alt=""
              style={{ width: "100", height: "200" }}
            />
          ) : (
            <img
              src={ImageURL}
              alt=""
              style={{ width: "100", height: "200" }} 
            />
          )}

          <span className="card-title"><i className="small material-icons left">star</i>{data.vote_average}</span>
        </div>
        <div className="card-content">{data.release_date}</div>
        <div className="card-action"  >
          <Link to={{ pathname: "/movie/:id" + data.id, movie_id: data.id }}>{data.title}</Link>
          {/* movie_id referred as the id variable which later gets called on moviedetails */}
        </div>
      </div>
    </div>
  );
};

export default Movie;