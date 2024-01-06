import streamlit as st
from dotenv import dotenv_values
from client.app_component import app_component

config = dotenv_values("../.env")

component = app_component(name="Man", key="sample_key")


def handle_value():
    '''print('search podcast')
    podcasts = feed.search_podcast('Knowledge Science - Alles über KI, ML und NLP', config=config)
    st.session_state['podcasts'] = podcasts
    # st.session_state.get('podcasts', podcasts)
    print(podcasts)
    '''


# Function to continuously check for changes
handle_value()
