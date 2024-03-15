# podcast2vdb

## Requirements & Installations

### Podcastindex.org

You need an account from pythonpodcastindex to get the necessary information about the podcast.

### HuggingFace

You need an account from HuggingFace to access the pyannote model.

### Docker

1. Install Docker Desktop
   1. https://milvus.io/docs/install_standalone-docker.md
   2. mkdir milvus_compose
   3. cd milvus_compose
   4. wget https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
2. Start

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

1. Start Docker
   1. `cd podcast2vdb/milvus_compose`
   2. `docker-compose up -d`
   3. `docker compose ps`
   4. `docker port milvus-standalone 19530/tcp`
2. Start React Components
   1. `cd podcast2vdb/src/client/app_component/frontend`
   2. `npm run start`
3. Start Streamlit
   1. `cd podcast2vdb/src`
   2. `streamlit run streamlit-app.py`
4. Start FastAPI
   1. `cd podcast2vdb/src/server`
   2. `uvicorn service:app --host 127.0.0.1 --port 8000 --reload` 

   A local running web-page will open automatically


