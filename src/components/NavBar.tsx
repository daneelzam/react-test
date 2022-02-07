import React from 'react';
import {Link, Route, Routes} from "react-router-dom";
import Send from "./send";
import Success from "./success";
import Welcome from "./welcome";

function NavBar() {
  return (
    <div>
      <nav className="navbar">
        <Link className="navbarLink" to='/'>Welcome</Link>
        <Link className="navbarLink" to='/send'>Send</Link>
      </nav>
      <Routes>
        <Route path={'/'} element={<Welcome/>}/>
        <Route path={'/send'} element={<Send/>}/>
        <Route path='/success' element={<Success/>}/>
      </Routes>
    </div>
  );
}

export default NavBar;
