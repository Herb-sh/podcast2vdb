import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';

import { Episode } from "./../../models/episode";

type Props = { episode: Episode | undefined };
type State = {}

export class EpisodeTranscribe extends React.Component<Props, State> {
    constructor(props) {
        super(props);
    }

    public render(){
        return (
            <div>
                <ProgressBar />
            </div>
        )
    }
}