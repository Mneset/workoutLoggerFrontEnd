import React from 'react';
import { Link } from 'react-router-dom';

function NavbarComponent() {
  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-light bg-light position-fixed w-100 fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Workout Logger</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/new-session">New Workout</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/session-history">History</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Plans</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;