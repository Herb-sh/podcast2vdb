import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { Podcast } from "./../../models/podcast";
import { BASE_URL, EPISODE_LIST_URL, EPISODE_LIST_VDB_URL,
         SEGMENT_LIST_VDB_URL, DELETE_EPISODE_VDB_URL } from "./../config";
import { Episode, EpisodeExtended } from "./../../models/episode";
import { EpisodeTranscribe } from "./episodeTranscribe"
import { SegmentList } from "./segmentList"
import { convertDurationToTime } from  "./../utility"


type Props = { podcast: Podcast | undefined };
type State = {
    episodes: Array<Episode>,
    filteredEpisodes: Array<Episode>,
    dbEpisodes: Array<Episode>,
    selectedEpisode?: Episode,
    openTranscribeModal: boolean,
    openSegmentModal: boolean,
    transcribeAll: boolean
};

export class EpisodeList extends React.Component<Props, State> {
    constructor(props) {
        super(props);
    }

  private _convertDurationToTime = convertDurationToTime;
  private _interval;

  public state: State = {
    episodes: [],
    filteredEpisodes: [],
    dbEpisodes: [],
    selectedEpisode: undefined,
    openTranscribeModal: false,
    openSegmentModal: false,
    transcribeAll: false
  }

  public componentDidMount() {
      this.getEpisodes(this.props?.podcast?.id);
      //
      this.getDBEpisodes(this.props?.podcast?.id);
  }

  public getEpisodes(podcastId: number | undefined) {
        const url = (EPISODE_LIST_URL + "").replace("{podcast_id}", (podcastId || '') + '');
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
            const url = (EPISODE_LIST_VDB_URL + "").replace("{podcast_id}", podcastId + '');
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
                this.state.dbEpisodes = jsonData;
                Streamlit.setComponentValue(jsonData);
              })
              .catch((error) => {
                // Handle errors
                console.error("Error fetching data:", error);
              });
  }

  public onSearch(searchField) {
    this.state.filteredEpisodes = searchField
                    ? (this.state?.episodes || []).filter(item => item.title.indexOf(searchField) !== -1)
                    : this.state?.episodes;
    Streamlit.setComponentValue(this.state);
  }

  public onOpenDetails(episode: Episode) {
        this.state.selectedEpisode = episode;
        this.state.openSegmentModal = true;
        Streamlit.setComponentValue(this.state);
  }

  // If close button is clicked
  public onCloseTranscribeModal = () =>  {
    this.state.openTranscribeModal = false;
    this.state.transcribeAll = false;
    //
    setTimeout( () => {
        this.getDBEpisodes(this.props?.podcast?.id); // refresh db episodes
    }, 1000);
    //
    Streamlit.setComponentValue(this.state);
  }

  public onFinishTranscribeItem = () => {
    this.state.openTranscribeModal = false;
    //
    setTimeout( () => {
       this.getDBEpisodes(this.props?.podcast?.id); // refresh db episodes
    }, 1000);
    //
    if (this.state.transcribeAll) {
        this.onNextEpisodeTranscribe();
    }
    Streamlit.setComponentValue(this.state);
  }

  public onTranscribe(episode: Episode) {
    this.state.selectedEpisode = episode;
    this.state.openTranscribeModal = true;
    Streamlit.setComponentValue(this.state);
  }

  public onAllTranscribe() {
    this.state.transcribeAll = true;
    this.onNextEpisodeTranscribe();
  }

  // Handles
  public onNextEpisodeTranscribe() {
    const episodes = this.state.episodes;
        const index = episodes.findIndex(item => item?.id === this?.state?.selectedEpisode?.id);
        const firstEpisode = episodes[0];
        const nextEpisode = episodes[index !== -1 ? index + 1 : 1]; // second item or greater

        if (!this.state.selectedEpisode) { // Start with the first episode
            const isTranscribed = (this.state.dbEpisodes.map(item => item.id).indexOf(firstEpisode.id) !== -1);
            if (isTranscribed) {
                this.state.selectedEpisode = nextEpisode;
                console.log('Episode is already transcribed. Moving to the next one!');
                this.onNextEpisodeTranscribe();
            } else {
                this.onTranscribe(firstEpisode)
            }
        } else {
            if (this.state.openTranscribeModal) // do nothing if transcription still on progress
                return;

            if (index === episodes.length - 1) { // remove interval if all episodes are transcribed
               this.state.transcribeAll = false;
            } else {
                const isTranscribed = (this.state.dbEpisodes.map(item => item.id).indexOf(nextEpisode.id) !== -1);
                if (isTranscribed) {
                    this.state.selectedEpisode = nextEpisode;
                    console.log('Episode is already transcribed. Moving to the next one!');
                    this.onNextEpisodeTranscribe();
                } else {
                    this.onTranscribe(nextEpisode)
                }
            }
        }
  }

  public onCloseSegmentModal = () => {
    this.state.openSegmentModal = false;
    Streamlit.setComponentValue(this.state);
  }

  public onDelete(episodeId: number) {
    const url = (DELETE_EPISODE_VDB_URL + "").replace("{episode_id}", (episodeId || '') + '');
            fetch(url)
              .then(async (response) => {
                // Check if the response is successful (status code 200)
                if (response.ok) {
                  return await response.json();
                }
                throw new Error("Network response was not ok.");
              })
              .then((jsonData) => {
                //
                setTimeout( () => {
                    this.getDBEpisodes(this.props?.podcast?.id); // refresh db episodes
                }, 1000)
              })
              .catch((error) => {
                // Handle errors
                console.error("Error fetching data:", error);
              });
  }

  public render = (): ReactNode => {
    const { podcast } = this.props;
    return (
         <div>
               <div className="row">
                    <div className="col-10">
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
                    </div>
                    <div className="col-2">
                        <button className="btn btn-success w-100"
                                onClick={(evt) => {this.onAllTranscribe()}}>
                                <i className="fas fa-cogs mr-2"></i>
                                Transcribe All
                        </button>
                    </div>
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
                                <div className="btn-group w-100">
                                    {(this.state.dbEpisodes.map(item => item.id).indexOf(episode.id) !== -1)
                                        && <button className="btn btn-sm btn-primary w-80"
                                        onClick={(evt) => {this.onOpenDetails(episode)}}>
                                        <i className="fas fa-plus-circle mr-2"></i>
                                        Details
                                    </button>}
                                    {(this.state.dbEpisodes.map(item => item.id).indexOf(episode.id) === -1)
                                    && <button className="btn btn-sm btn-success w-80"
                                        onClick={(evt) => {this.onTranscribe(episode)}}>
                                        <i className="fas fa-cogs mr-2"></i>
                                        Transcribe
                                    </button>}
                                    {(this.state.dbEpisodes.map(item => item.id).indexOf(episode.id) !== -1)
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

                   <Modal size="lg" show={this.state.openTranscribeModal} onHide={this.onCloseTranscribeModal} backdrop="static">
                      <Modal.Header closeButton>
                          <Modal.Title className="text-center w-100">
                              {this.state.selectedEpisode?.title}
                          </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                           <EpisodeTranscribe episode={this.state.selectedEpisode} onFinish={this.onFinishTranscribeItem} />
                      </Modal.Body>
                   </Modal>

                   <Modal size="lg" show={this.state.openSegmentModal} onHide={this.onCloseSegmentModal}>
                      <Modal.Header closeButton>
                         <Modal.Title className="text-center w-100">
                             {this.state.selectedEpisode?.title}
                         </Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                            <SegmentList episode={this.state.selectedEpisode} onClose={this.onCloseSegmentModal} />
                         </Modal.Body>
                      </Modal>
            </div>
        )
    }
}