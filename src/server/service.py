from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values
from feed import search_podcast, get_episodes, get_episode, download_episode
from db import main, create_collections, insert
from core import transcribe

import podcastindex
config = dotenv_values("../../.env")

##uvicorn service:app --host 0.0.0.0 --port 80 --reload

app = FastAPI()

origins = [
    "http://localhost:3001",
    "http://localhost:8501/",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the podcast transcription as a service API!"}


@app.get("/v1/podcast/{podcast_name}")
def feed(podcast_name: str):
    '''
    Search for podcast with a certain podcast_name.
    '''
    '''
    podcastindex_config = {
        'api_key': config['PODCASTINDEX_API_KEY'],
        'api_secret': config['PODCASTINDEX_API_SECRET']
    }
    index = podcastindex.init(podcastindex_config)
    return index.search(podcast_name, max_results=20)
    '''
    return search_podcast(podcast_name)


@app.get("/v1/podcast/episodes/{podcast_id}")
async def get_episode_list(podcast_id: str,  max_results: int = 100, last_saved_episode : int = 0):
    '''
    get all episodes of a given podcast up to limit of max_result since last_saved_episode
    '''
    return get_episodes(podcast_id, max_results=max_results)

# VectorDB call, Items found are already transcribed

@app.get("/v1/transcribe/episode/{episode_id}")
async def get_vdb_episode_list(episode_id: str):
    #
    result = get_episode(episode_id=episode_id)
    episode = result['episode']
    #
    filename_audio = download_episode(episode_url=episode['enclosureUrl'], episode_id=episode['id'])
    print(filename_audio)
    print('DOWNLOADED!!!')
    #
    (filename_transcript, transcript) = transcribe(episode['id'], filename_audio, diarize=False)
    #
    print('Transcribed!')
    transcript_parsed = transcript['parsed_transcript']
    print(transcript_parsed)
    return transcript_parsed
    #
    main()
    #
    print('Connection established')
    #
    create_collections()
    #
    insert("segment", transcript_parsed)
    return []


# @TODO 2 calls to implement
@app.get("/v1/vdb/podcast/episodes/{podcast_id}")
def get_vdb_episode_list(podcast_id: str):
    return []

@app.get("/v1/vdb/episode/{podcast_id}")
def get_vdb_episode_list(podcast_id: str):
    return []

