import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { Podcast } from "./../../models/podcast";
import { BASE_URL, EPISODE_LIST_URL } from "./../config";
import { Episode, EpisodeExtended } from "./../../models/episode";
import { EpisodeTranscribe } from "./episodeTranscribe"


type Props = { podcast: Podcast | undefined };
type State = {
    episodes: Array<Episode>,
    filteredEpisodes: Array<Episode>,
    dbEpisodes: Array<number>,
    selectedEpisode?: Episode,
    openTranscribeModal: boolean
};

export class PodcastDetails extends React.Component<Props, State> {
    constructor(props) {
        super(props);
    }

  public state: State = {
    episodes: [],
    filteredEpisodes: [],
    dbEpisodes: [],
    selectedEpisode: undefined,
    openTranscribeModal: false
  }


  public componentDidMount() {
      this.getEpisodes(this.props?.podcast?.id);
      //
      this.getDBEpisodes(this.props?.podcast?.id);
  }

  public getEpisodes(podcastId: number | undefined) {
        const url = (EPISODE_LIST_URL + "").replace("{podcast_id}", podcastId + '');
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
            this.state.episodes = (jsonData || []).sort((a, b) => { return a.title - b.title; });
            this.state.filteredEpisodes = this.state.episodes;
            Streamlit.setComponentValue(jsonData);
          })
          .catch((error) => {
            // Handle errors
            console.error("Error fetching data:", error);
          });
  }

  public getDBEpisodes(podcastId: number | undefined) {
    this.state.dbEpisodes = [];
  }

  public onSearch(searchField) {
    this.state.filteredEpisodes = searchField
                    ? (this.state?.episodes || []).filter(item => item.title.indexOf(searchField) !== -1)
                    : this.state?.episodes;
    Streamlit.setComponentValue(this.state);
  }

  public onOpenDetails(episodeId: number) {
    console.log('open details');
  }

  public onCloseTranscribeModal = () =>  {
    this.state.openTranscribeModal = false;
    Streamlit.setComponentValue(this.state);
  }

  public onTranscribe(episode: Episode) {
    this.state.selectedEpisode = episode;
    this.state.openTranscribeModal = true;
    Streamlit.setComponentValue(this.state);
  }

  public onDelete(episodeId: number) {
    console.log('delete');
  }

  public render = (): ReactNode => {
    const { podcast } = this.props;
    return (
         <div>
            <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          onChange={(evt) => this.onSearch(evt.target.value)}
                          placeholder="Search episodes"
                        />
                        <span
                          className="input-group-text btn btn-primary"
                          id="basic-addon2"
                          onClick={this.onSearch}
                        >
                          Search
                        </span>
                      </div>
            {this.state.episodes.length != 0 && <table className="table">
                     <thead>
                       <tr>
                         <th> </th>
                         <th scope="col">Date</th>
                         <th scope="col">Title</th>
                         <th scope="col">Description</th>
                         <th scope="col">Duration</th>
                         <th scope="col"></th>
                       </tr>
                     </thead>
                     <tbody>
                        {this.state.filteredEpisodes.map(episode =>
                           <tr key={episode['id']}>
                              <td>
                                 <img width="40" height="40" src={episode['feedImage']} />
                              </td>
                              <td>{episode['datePublishedPretty']}</td>
                              <td>
                                 {episode['title']}
                              </td>
                              <td><div dangerouslySetInnerHTML={{ __html: episode['description'] }} /></td>
                              <td>{this._convertDurationToTime(episode['duration'])}</td>
                              <td>
                                <div className="btn-group">
                                    {(this.state.dbEpisodes.indexOf(episode.id) !== -1)
                                        && <button className="btn btn-sm btn-primary w-80"
                                        onClick={(evt) => {this.onOpenDetails(episode.id)}}>
                                        <i className="fas fa-plus-circle mr-2"></i>
                                        Details
                                    </button>}
                                    {(this.state.dbEpisodes.indexOf(episode.id) === -1)
                                    && <button className="btn btn-sm btn-success w-80"
                                        onClick={(evt) => {this.onTranscribe(episode)}}>
                                        <i className="fas fa-cogs mr-2"></i>
                                        Transcribe
                                    </button>}
                                    {(this.state.dbEpisodes.indexOf(episode.id) !== -1)
                                    && <button className="btn btn-sm btn-danger w-80"
                                        onClick={(evt) => {this.onDelete(episode.id)}}>
                                        <i className="fas fa-trash-alt mr-2"></i>
                                     Remove
                                  </button>}
                                </div>
                              </td>
                           </tr>
                         )}
                     </tbody>
                   </table>}

                   <Modal size="lg" show={this.state.openTranscribeModal} onHide={this.onCloseTranscribeModal}>
                      <Modal.Header closeButton>
                          <Modal.Title className="text-center w-100">
                              {this.state.selectedEpisode?.title}
                          </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                           <EpisodeTranscribe episode={this.state.selectedEpisode} onClose={this.onCloseTranscribeModal} />
                      </Modal.Body>
                   </Modal>
            </div>
        )
    }

       private _convertDurationToTime(seconds) {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const remainingSeconds = seconds % 60;

          // Format the result
          const formattedTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

          return formattedTime;
        };
}