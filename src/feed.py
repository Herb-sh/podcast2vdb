import os
import podcastindex
import requests
from dotenv import dotenv_values
config = dotenv_values("../.env")


DIR_SOURCE = '../data/raw/'

os.makedirs(DIR_SOURCE, exist_ok=True)


def search_podcast(podcast_name:str, config:dict=config):
    '''
    Search for podcast with a certain podcast_name.
    '''
    podcastindex_config = {
        'api_key': config['PODCASTINDEX_API_KEY'],
        'api_secret': config['PODCASTINDEX_API_SECRET']
    }
    index = podcastindex.init(podcastindex_config)
    return index.search(podcast_name)


def get_episodes(podcast_id:int, since:int=0, max_results:int=100, config:dict=config):
    '''
    Get all episodes of a certain podcast with podcast_id.
    '''
    podcastindex_config = {
        'api_key':  config['PODCASTINDEX_API_KEY'],
        'api_secret': config['PODCASTINDEX_API_SECRET']
    }
    index = podcastindex.init(podcastindex_config)
    result = index.episodesByFeedId(podcast_id, since=since, max_results=max_results)
    if result['status']:
        return result['items']
    else:
        return []


def download_episode(episode_url, dir=DIR_SOURCE, episode_id=None):
    if episode_id is None:
        filename = episode_url.split('/')[-1]
    else:
        filename = str(episode_id) + '.' + episode_url.split('.')[-1]
    path = dir + filename
    if not os.path.isfile(path):
        print('Downloading ' + episode_url + '...')
        with requests.get(episode_url, stream=True) as response:
            with open(path, mode="wb") as file:
                for chunk in response.iter_content(chunk_size=10 * 1024):
                    file.write(chunk)
    else:
        print(episode_url + ' already downloaded!')

    return path



#%%
