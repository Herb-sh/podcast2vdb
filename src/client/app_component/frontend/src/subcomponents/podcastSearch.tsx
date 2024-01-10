import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode, useState } from "react";
import { Podcast } from "./../models";

const BASE_URL = "http://127.0.0.1:8000";
const PODCAST_SEARCH_URL = BASE_URL + "/v1/podcast/{podcast_name}";
const PODCAST_EPISODE_LIST_URL = BASE_URL + "/v1/podcast/episodes/{podcast_id}";

export class Podcasts extends React.Component {
  public state: { searchInput: string; podcasts: Array<Podcast> } = {
    podcasts: [],
    searchInput: "",
  };

  public onSearch = (event) => {
    this.state.searchInput = event.target.value;
    Streamlit.setComponentValue(this.state);
    // Fetch data from the API endpoint
    const uri = encodeURIComponent(this.state.searchInput);
    const url = (PODCAST_SEARCH_URL + "").replace("{podcast_name}", uri);
    fetch(url)
      .then(async (response) => {
        // Check if the response is successful (status code 200)
        if (response.ok) {
          return await response.json();

          // this.setState({ podcasts: data.feeds })
        }
        throw new Error("Network response was not ok.");
      })
      .then((jsonData) => {
        // Handle the received data
        this.state.podcasts = jsonData.feeds;
        Streamlit.setComponentValue(jsonData);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  };

  public render = (): ReactNode => {
    return (
      <div>
        <div className="pagetitle">
          <h1>Podcast Search</h1>
        </div>
        <section className="section">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={this.state.searchInput}
              onChange={(evt) => this.onSearch(evt)}
              placeholder="Search podcasts"
            />
            <span
              className="input-group-text btn btn-primary"
              id="basic-addon2"
              onClick={this.onSearch}
            >
              Load podcasts
            </span>
          </div>

          <div className="list-group">
            {this.state.podcasts.map((podcast, index) => (
              <a
                className="list-group-item list-group-item-action  {index === 0 ? 'active' : ''}"
                key={podcast.id}
              >
                {podcast.author}
              </a>
            ))}
          </div>
        </section>
      </div>
    );
  };
}
