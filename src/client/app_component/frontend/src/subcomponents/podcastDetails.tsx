import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { Podcast } from "./../../models/podcast";
import { Episode } from "./../../models/episode";

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
            this.state.episodes = jsonData;
            console.log('jsonData', jsonData);
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
             {podcast?.id}
             <ul>
            {this.state.episodes.map(episode =>
                <li key={episode.id}>
                    {episode.title} {episode.datePublishedPretty}
                </li>
             )}
             </ul>
         </div>
        )
    }
}