import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Podcast } from "./../../models/podcast";
import { PodcastDetails } from "./podcastDetails";

const BASE_URL = "http://127.0.0.1:8000";
const PODCAST_SEARCH_URL = BASE_URL + "/v1/podcast/{podcast_name}";
const PODCAST_EPISODE_LIST_URL = BASE_URL + "/v1/podcast/episodes/{podcast_id}";

export class Podcasts extends React.Component {
  constructor(props) {
    super(props);
    this.onSearch('Knowledge Science - Alles über KI, ML und NLP'); // @TODO remove later
  }
  public state: { searchInput: string; podcasts: Array<Podcast>; selectedPodcast?: Podcast; openDetailsModal: boolean } = {
    podcasts: [],
    searchInput: "",
    openDetailsModal: false,
    selectedPodcast: undefined
  };

  public onSearch = (value) => {
    this.state.searchInput = value;
    if (!this.state.searchInput || this.state.searchInput.length < 3) {
       this.state.podcasts = []
        Streamlit.setComponentValue(this.state);
       return;
    }
    Streamlit.setComponentValue(this.state);

    // Fetch data from the API endpoint
    const uri = encodeURIComponent(this.state.searchInput);
    const url = (PODCAST_SEARCH_URL + "").replace("{podcast_name}", uri);
    fetch(url)
      .then(async (response) => {
        // Check if the response is successful (status code 200)
        if (response.ok) {
          return await response.json();
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

  public openDetailsModal = (podcast: Podcast) => {
      this.state.openDetailsModal = true;
      this.state.selectedPodcast = podcast;
      Streamlit.setComponentValue(this.state);
  }

  public closeDetailsModal = () => {
  console.log('closeDetailsModal')
      this.state.openDetailsModal = false;
      Streamlit.setComponentValue(this.state);
    }

  public close

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
              onChange={(evt) => this.onSearch(evt.target.value)}
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
          {this.state.podcasts.length != 0 && <table className="table">
            <thead>
              <tr>
                <th> </th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Description</th>
                <th scope="col">UpdatedAt</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
               {this.state.podcasts.map(pod =>
                  <tr key={pod.id}>
                     <td>
                        <img width="40" height="40" src={pod.image} />
                     </td>
                     <td>
                        <a href={pod.link}  target="_blank">{pod.title}</a>
                     </td>
                     <td>{pod.author}</td>
                     <td>{pod.description}</td>
                     <td>{pod.lastUpdateTime}</td>
                     <td>
                        <button className="btn btn-sm btn-primary w-80" onClick={(evt) => this.openDetailsModal(pod)}>
                           <i className="fas fa-podcast mr-2"></i>
                           Open ({pod.episodeCount} Ep.)
                        </button>
                     </td>
                  </tr>
                )}
            </tbody>
          </table>}

          {this.state.searchInput && <div className="text-center">Search returned {this.state.podcasts.length} item/s.</div>}
        </section>

        <Modal size="lg" show={this.state.openDetailsModal} onHide={this.closeDetailsModal}>
           <Modal.Header closeButton>
               <Modal.Title>
                    <i className="fas fa-podcast fa-lg mr-2"></i>
                    {this.state.selectedPodcast?.title}
               </Modal.Title>
           </Modal.Header>
           <Modal.Body>
             <PodcastDetails podcast={this.state.selectedPodcast} />
           </Modal.Body>
           <Modal.Footer>
              <Button variant="secondary" onClick={this.closeDetailsModal}>
                  Close
              </Button>
              <Button variant="primary" onClick={this.closeDetailsModal}>
                  Save Changes
              </Button>
           </Modal.Footer>
        </Modal>
      </div>
    )};
}
