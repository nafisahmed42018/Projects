import React from "react";
import {Link} from 'react-router-dom'
//import { a } from "react-router-dom";
const Navbar = () => {
  return (
    <div>
      <nav>
        <div className="nav-wrapper blue" >
          <Link to="/" className="brand-logo" style={{ marginLeft: 20 }}>
            Movie DB
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <Link to="/">Popular Movies</Link>
            </li>
            <li>
              <Link to="#!">TV Shows</Link>
            </li>
            <li>
              <Link to="#!">Profile</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;