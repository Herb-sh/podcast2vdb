# podcast2vdb

## Requirements

### Podcastindex.org

You need an account from pythonpodcastindex to get the necessary information about the podcast.

### HuggingFace

You need an account from HuggingFace to access the pyannote model.

### Docker

1. Install Docker Desktop
2. Start
   1. docker-compose up -d
   2. docker compose ps
   3. docker port milvus-standalone 19530/tcp
3. Stop
   1. docker compose down

## Running App

1. Start Streamlit
   1. `cd podcast2vdb/src` 
   2. `streamlit run app.py`
   3. A local running web-page will open automatically


