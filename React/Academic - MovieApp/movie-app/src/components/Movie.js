import React from "react";


const Movie = (props) => {
  const ImageURL = "https://image.tmdb.org/t/p/w500/" + props.data.poster_path;
  return (
    <div className="col s12 m4">
      <div className="card">
        <div className="card-image">
          {props.data.poster_path == null ? (
            <img
              src="https://picsum.photos/200/300"
              alt=""
              style={{ width: "100", height: "200" }}
            />
          ) : (
            <img
              src={ImageURL}
              alt=""
              style={{ width: "80", height: "160" }}
            />
          )}

          <span className="card-title"><i className="small material-icons left">star</i>{props.data.vote_average}</span>
        </div>
        <div className="card-content">{props.data.release_date}</div>
        <div className="card-action">
          <a href="#!">{props.data.title}</a>
        </div>
      </div>
    </div>
  );
};

export default Movie;