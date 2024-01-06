import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode, useState } from "react"
import { Podcast } from './models';

// @TODO 1. define readonly Urls
// @TODO 2 define model for podcast
const BASE_URL = 'http://127.0.0.1:8000'
const PODCAST_SEARCH_URL = BASE_URL + '/v1/podcast/{podcast_name}';
const PODCAST_EPISODE_LIST_URL = BASE_URL + '/v1/podcast/episodes/{podcast_id}';

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class AppComponent extends StreamlitComponentBase { // State
  public render = (): ReactNode => {
    return (
      <Podcasts/>
    )
  }
}

export class Podcasts extends React.Component {
  public state: {podcasts: Array<Podcast>} = { podcasts: []}

  public onClicked = () => {
    console.log('onClicked');
         // Fetch data from the API endpoint
             const uri = encodeURIComponent('Knowledge Science - Alles über KI, ML und NLP');
             const url = (PODCAST_SEARCH_URL + '').replace('{podcast_name}', uri);
             console.log(url);
             fetch(url)
               .then(async (response) => {
                 // Check if the response is successful (status code 200)
                 if (response.ok) {
                   return await response.json();

                   // this.setState({ podcasts: data.feeds })

                 }
                 throw new Error('Network response was not ok.');
               })
               .then((jsonData) => {
                 // Handle the received data
                 console.log('Received data:', jsonData);
                  this.state.podcasts = jsonData.feeds;
                  Streamlit.setComponentValue(jsonData)
               })
               .catch((error) => {
                 // Handle errors
                 console.error('Error fetching data:', error);
               });
  }

  public render = (): ReactNode => {
    return (
              <span>
                <button onClick={this.onClicked}>
                  Load podcasts
                </button>
               <ul>
               <ul>
                   {this.state.podcasts.map((podcast) => (
                   <li key={podcast.id}>{podcast.author}</li>
                   ))}
               </ul>
              </ul>
              </span>
        )
  }
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(AppComponent)
