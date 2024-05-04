import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import { BASE_URL, EPISODE_TRANSCRIBE_URL } from "./../config";

import { Episode } from "./../../models/episode";

type Props = { episode: Episode | undefined, onFinish: Function };
type State = { episode: Episode | undefined};

export class EpisodeTranscribe extends React.Component<Props, State> {
  public props: Props;
   public state: State = {
    episode: undefined
  };
  constructor(props) {
    super(props);
    this.props = props;
  }

  public componentDidMount() {
      this.startTranscription();
  }

  public startTranscription() {
    const episodeId = this.props.episode?.id;
    const url = (EPISODE_TRANSCRIBE_URL + "").replace("{episode_id}", episodeId + "");
    fetch(url)
      .then(async (response) => {
        // Check if the response is successful (status code 200)
        if (response.ok) {
          return await response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((jsonData) => {
        this.transcriptionFinished();
        Streamlit.setComponentValue(jsonData);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }

  public transcriptionFinished() {
    this.props.onFinish();
  }

  public render() {
    return (
      <div>
        <ProgressBar striped variant="info" now={100} className="my-3" />
        <div className="w-100 text-center">
            Transcription on progress. Please wait...
        </div>
      </div>
    );
  }
}
