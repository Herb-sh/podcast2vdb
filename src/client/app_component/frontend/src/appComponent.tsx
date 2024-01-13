import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import { Dashboard } from "./subcomponents/dashboard";
import { Podcasts } from "./subcomponents/podcastSearch";
import { SavedPodcasts } from "./subcomponents/savedPodcasts";

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class AppComponent extends StreamlitComponentBase {
  public menuItems = [
        { path: '/', label: 'Dashboard', icon: 'fas fa-th-large', active: true},
        { path: '/searchPodcasts', label: 'Search Podcasts', icon: 'fas fa-search', active: false},
        { path: '/savedPodcasts', label: 'Saved Podcasts', icon: 'fas fa-save', active: false},
      ];

  public onMenuItemClick = (menu) => {
    this.menuItems.forEach((item) => {
        item.active = menu.path === item.path;
    });
    Streamlit.setComponentValue(this.menuItems);
  }
  // State
  public render = (): ReactNode => {
    return (
      <Router>
        <div className="wrapper">
          <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                {this.menuItems.map((item, index) => (
                     <li key={index} className="nav-item">
                        <Link to={item.path} className={item.active
                                                        ? 'nav-link active' : 'nav-link collapsed'}
                                                        onClick={(evt) => this.onMenuItemClick(item)}>
                           <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
            </ul>
          </aside>
          <div id="main" className="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/searchPodcasts" element={<Podcasts />} />
              <Route path="/savedPodcasts" element={<SavedPodcasts />} />
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
