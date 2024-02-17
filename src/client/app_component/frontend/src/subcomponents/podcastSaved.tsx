import React, { ReactNode } from "react";
import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import { PODCAST_LIST_VDB_URL, EPISODE_LIST_VDB_URL, SEGMENT_LIST_VDB_URL } from "./../config";
import { Segment } from "./../../models/segment";
import { Episode } from "./../../models/episode";
import { Podcast } from "./../../models/podcast";
import { convertDurationToTime } from  "./../utility"

export class PodcastSaved extends React.Component {
    private _convertDurationToTime = convertDurationToTime;

    public state: {podcasts: Array<Podcast>, selectedPodcast: Podcast | undefined,
                   episodes: Array<Episode>, selectedEpisode: Episode | undefined,
                   segments: Array<Segment>} = {
        podcasts: [],
        selectedPodcast: undefined,
        episodes: [],
        selectedEpisode: undefined,
        segments: []
    }
    public componentDidMount() {
      this.getSavedPodcasts();
    }

    public getSavedPodcasts() {
        const url = PODCAST_LIST_VDB_URL
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
               this.state.podcasts = jsonData;
               Streamlit.setComponentValue(jsonData);
             })
             .catch((error) => {
               // Handle errors
               console.error("Error fetching data:", error);
             });
     }

     public getEpisodes(podcastId) {
          const url = EPISODE_LIST_VDB_URL
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
            <div>
                <div className="pagetitle">
                  <h1>Saved Podcasts</h1>
                </div>
                <section className="section">
                    <ul>
                        {this.state.segments.map((segment, i) =>
                             <li key={i}>
                                {convertDurationToTime(segment['start'])} - {convertDurationToTime(segment['end'])} :
                                {segment['text']}
                             </li>
                        )}
                    </ul>
                </section>
            </div>
        )
    };
}