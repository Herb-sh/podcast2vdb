import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { Podcast } from "./../../models/podcast";
import { Episode, EpisodeExtended } from "./../../models/episode";

const BASE_URL = "http://127.0.0.1:8000";
const PODCAST_EPISODE_LIST_URL = BASE_URL + "/v1/podcast/episodes/{podcast_id}";

type Props = { podcast: Podcast | undefined };
type State = { episodes: Array<Episode> };

export class PodcastDetails extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        // called twice!
        this.getEpisodes(this.props?.podcast?.id);
    }

  public state: State = {
    episodes: []
  }

  public getEpisodes(podcastId: number | undefined) {
        const url = (PODCAST_EPISODE_LIST_URL + "").replace("{podcast_id}", podcastId + '');
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
            Streamlit.setComponentValue(jsonData);
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
            {this.state.episodes.length != 0 && <table className="table">
                     <thead>
                       <tr>
                         <th> </th>
                         <th scope="col">Title</th>
                         <th scope="col">Description</th>
                         <th scope="col">Duration</th>
                         <th scope="col">Date</th>
                         <th scope="col"></th>
                       </tr>
                     </thead>
                     <tbody>
                        {this.state.episodes.map(episode =>
                           <tr key={episode['id']}>
                              <td>
                                 <img width="40" height="40" src={episode['feedImage']} />
                              </td>
                              <td>
                                 {episode['title']}
                              </td>
                              <td><div dangerouslySetInnerHTML={{ __html: episode['description'] }} /></td>
                              <td>{episode['duration']}</td>
                              <td>{episode['datePublishedPretty']}</td>
                              <td>
                                 <button className="btn btn-sm btn-primary w-80">
                                    <i className="fas fa-closed-captioning mr-2"></i>
                                    Cl
                                 </button>
                              </td>
                           </tr>
                         )}
                     </tbody>
                   </table>}
            </div>
        )
    }
}