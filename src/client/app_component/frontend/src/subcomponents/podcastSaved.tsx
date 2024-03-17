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
               console.log('jsonData', jsonData)
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
                              {this.state.podcasts.length != 0 && <table className="table">
                                <thead>
                                  <tr>
                                    <th> </th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Author</th>
                                    <th scope="col">Description</th>
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
                                         <td>{Object.values(pod.categories || []).join(', ')}</td>
                                      </tr>
                                    )}
                                </tbody>
                              </table>}
                              <div className="text-center">There are {this.state.podcasts.length} saved item/s.</div>
                              <div className="text-center text-info mt-5">
                                   <b>Disclaimer:</b> This page is a basic overview of saved podcasts.
                              </div>
                              <div className="text-center text-info">
                                   All transcribed episodes and segments are available in "Podcast Search" (if there are any).
                              </div>
                </section>
            </div>
        )
    };
}