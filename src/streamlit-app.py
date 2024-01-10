import streamlit as st
from dotenv import dotenv_values
from client.app_component import app_component

config = dotenv_values("../.env")

st.set_page_config(layout="wide")
st.markdown(
    """
    <style>
    .block-container {
        padding-top: 46px !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 0 !important;
    }
    </style>
    """,
    unsafe_allow_html=True
)
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
