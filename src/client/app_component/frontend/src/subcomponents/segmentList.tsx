import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import { Episode } from "./../../models/episode";
import { Segment } from "./../../models/segment";
import { SEGMENT_LIST_VDB_URL } from "./../config";
import { convertDurationToTime } from  "./../utility"


type Props = { episode: Episode | undefined, onClose: Function };
type State = { segments: Array<Segment> }
export class SegmentList extends React.Component<Props, State>  {
    public props: Props;
    public state: { segments: Array<Segment> } = {
        segments: []
    }

    constructor(props) {
         super(props);
         this.props = props;
    }

    public componentDidMount() {
        if (this.props.episode?.id) {
            this.getSegmentList(this.props.episode?.id);
        }
    }

     public getSegmentList(episodeId: number) {
        console.log(episodeId);
             const url = SEGMENT_LIST_VDB_URL.replace("{episode_id}", episodeId + "")
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
                    this.state.segments = jsonData.sort((a, b) => a.start - b.start);
                    Streamlit.setComponentValue(jsonData);
                  })
                  .catch((error) => {
                    // Handle errors
                    console.error("Error fetching data:", error);
                  });
     }

     public render = (): ReactNode => {
        return (
                <section className="section">
                   <ul className="list-group">
                      {this.state.segments.map((segment, i) =>
                         <li key={i} className={ i%2 == 0 ? 'list-group-item list-group-item-primary': 'list-group-item list-group-item-light'}>
                            <span className="text-primary">{convertDurationToTime(segment['start'])} - {convertDurationToTime(segment['end'])}</span> :
                            {segment['text']}
                         </li>
                      )}
                   </ul>
                </section>
        )
     }
}