# podcast2vdb

## Requirements & Installations

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

### Streamlit

@TODO Streamlit & React Installation


React component
1. `cd podcast2vdb/src/client/app_component/frontend`
2. `npm install`  # Initialize the project and install npm dependencies
3. `npm run start` # Repeated later on every start-run

Refer to [Streamlit documentation](https://docs.streamlit.io/library/components/components-api) for more details.

## Running App

1. Start React Components
   1. `cd podcast2vdb/src/client/app_component/frontend`
   2. `npm run start`
2. Start Streamlit
   1. `cd podcast2vdb/src`
   2. `streamlit run streamlit-app.py`
3. Start FastAPI
   1. `uvicorn service:app --host 127.0.0.1 --port 8000 --reload` 
A local running web-page will open automatically


