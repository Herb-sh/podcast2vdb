import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { Podcasts } from "./subcomponents/podcastSearch";

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Contact = () => <h2>Contact</h2>;

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class AppComponent extends StreamlitComponentBase {
  // State
  public render = (): ReactNode => {
    return (
      <Router>
        <div className="wrapper">
          <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  <i className="fas fa-search"></i>
                  <span>Search Podcasts</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link collapsed" to="/route1">
                  <i className="fas fa-save"></i>
                  <span>Saved Podcasts</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link collapsed" to="/route2">
                  <i className="fas fa-info-circle"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </aside>
          <div id="main" className="main">
            <Routes>
              <Route path="/" element={<Podcasts />} />
              <Route path="/route1" element={<About />} />
              <Route path="/route2" element={<Contact />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  };
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(AppComponent);
