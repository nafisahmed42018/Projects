import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter,Route } from "react-router-dom";
import MovieDetail from "./components/MovieDetail";
import Navbar from "./components/Navbar";

ReactDOM.render(
  <React.StrictMode>
    
    <BrowserRouter>
      <div>
        <Navbar/>
        <Route path="/" exact component={App}/>
        <Route path="/movie/:id" exact component={MovieDetail}/>
        
      </div>
    </BrowserRouter>
    
  </React.StrictMode>,
  document.getElementById("root")
);