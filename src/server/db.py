import pandas as pd
import numpy as np

rng = np.random.default_rng(seed=19530)
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)

HOST = 'localhost'
PORT = '19530'
FIELDS = ["id", "speaker", "start", "end", "text", "episode_id", "embedding"]


#### Connection
def create_connection():
    print(f"\nCreate connection...")
    connections.connect(host=HOST, port=PORT)
    print(f"\nList connections:")
    print(connections.list_connections())


# @TODO Podcast & Episode Collection most likely are not needed
def create_collections(dim=4):
    #
    podcast_fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
        FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="description", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="author", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="image", dtype=DataType.VARCHAR, max_length=10000),
        # FieldSchema(name="categories", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1),
    ]

    # Saving only the most necessary fields
    episode_fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
        FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="description", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="datePublishedPretty", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="image", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="enclosureUrl", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="podcast_id", dtype=DataType.INT64),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1),
    ]

    segment_fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="episode_id", dtype=DataType.INT64),
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="start", dtype=DataType.DOUBLE),
        FieldSchema(name="end", dtype=DataType.DOUBLE),
        FieldSchema(name="speaker", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=dim),
    ]

    # Collection Schema
    podcast_schema = CollectionSchema(fields=podcast_fields, description="podcast")
    episode_schema = CollectionSchema(fields=episode_fields, description="episode")
    segment_schema = CollectionSchema(fields=segment_fields, enable_dynamic_field=True, auto_id=True,
                                      description="segment")

    # Collection
    # If it exists, drop and recreate
    if utility.has_collection("podcast"):
        collection_podcast = Collection("podcast")
        collection_podcast.drop()  # Recreate
        # Recreate
    collection_podcast = Collection("podcast", podcast_schema)

    if utility.has_collection("episode"):
        collection_episode = Collection("episode")
        collection_episode.drop()  # Recreate
        # Recreate
    collection_episode = Collection("episode", episode_schema)

    if utility.has_collection("segment"):
        collection_segment = Collection("segment")
        collection_segment.drop()  # Recreate
    collection_segment = Collection("segment", segment_schema)

    #
    index = {
        "index_type": "IVF_FLAT",
        "metric_type": "L2",
        "params": {"nlist": 128},
    }

    collection_podcast.create_index("embedding", index)
    collection_episode.create_index("embedding", index)
    collection_segment.create_index("embedding", index)


#### CRUD Operations
def get_collection_list():
    return (utility.list_collections())


# Get Transcription By FileId
def get_podcast_list():
    collection_name = 'podcast'
    collection = None
    if utility.has_collection(collection_name):
        collection = Collection(collection_name)
    else:
        print("Collection not available!")

    collection.load()

    # Query the collection by ID
    search_param = {
        'data': [[1] * 1],
        'anns_field': 'embedding',
        'param': {'metric_type': 'L2', 'params': {'nlist': 128}},
        'limit': 1,
        'expr': "id >= 0",
        'output_fields': ['id', 'title', 'description', 'author', 'image']
    }
    collection.load()
    # Search for all vectors in the collection
    results = collection.search(**search_param)

    retrieved_text = [{
        'id': result.entity.get("id"),
        'title': result.entity.get("title"),
        'description': result.entity.get("description"),
        'author': result.entity.get("author"),
        'image': result.entity.get("image")
    } for result in results[0]]

    return retrieved_text


def get_episode_list_by_podcast_id(podcast_id:int):
    collection_name = 'episode'
    collection = None
    if utility.has_collection(collection_name):
        collection = Collection(collection_name)
    else:
        print("Collection not available!")

    collection.load()

    # Query the collection by ID
    search_param = {
        'data': [[1] * 1],
        'anns_field': 'embedding',
        'param': {'metric_type': 'L2', 'params': {'nlist': 128}},
        'limit': 1,
        'expr': "podcast_id == 'podcast_id'",
        'output_fields': ['id', 'title', 'description', 'datePublishedPretty',
                          'image', 'enclosureUrl', 'podcast_id']
    }
    collection.load()
    # Search for all vectors in the collection
    results = collection.search(**search_param)

    retrieved_text = [{
        'id': result.entity.get("id"),
        'title': result.entity.get("title"),
        'description': result.entity.get("description"),
        'author': result.entity.get("author"),
        'image': result.entity.get("image")
    } for result in results[0]]

    return retrieved_text


def get_segment_list_by_episode_id(collection_name: str, max_dimension: int, episode_id: int):
    # Check if the collection exists
    if utility.has_collection(collection_name):
        # Get the collection
        collection = Collection(collection_name)
        # Set top_k to a large value to retrieve all entities
        search_param = {
            'data': [[1] * max_dimension],
            'anns_field': 'embedding',
            'param': {'metric_type': 'L2', 'params': {'nlist': 128}},
            'limit': max_dimension,
            'expr': "id >= 0",
            'output_fields': ['episode_id', 'text', 'start', 'end', 'speaker']  # , 'embedding
        }
        collection.load()
        # Search for all vectors in the collection
        results = collection.search(**search_param)
        retrieved_text = [{
            'text': result.entity.get("text"),
            'start': result.entity.get("start"),
            'end': result.entity.get("end"),
            'episode_id': result.entity.get("episode_id"),
            'speaker': result.entity.get("speaker")
        } for result in results[0]]

        return retrieved_text


# Insert Transcription
def insert(collection_name, item):
    collection = Collection(collection_name)
    # db_item = get_item_by_id(collection_name, item.id)  # @TODO uncomment later
    # if not db_item:
    collection.insert(item)

    # After final entity is inserted, it is best to call flush to have no growing segments left in memory
    collection.flush()

    print(f"Number of entities in DB: {collection.num_entities}")
    return collection_name


# Update Transcription

# Delete Transcription
def delete_podcast_by_id():
    # 1. delete podcast
    # 2. delete episodes
    # 3. delete transcriptions
    return False


def delete_episode_by_id():
    # 1. delete episode
    # 2. delete transcriptions
    return False


def delete_item_by_id(collection_name: str, id):
    collection = None
    if utility.has_collection(collection_name):
        collection = Collection(collection_name)
    else:
        print("Collection not available!")
    expr = f"id=={id}"
    result = collection.query(expr=expr)
    print(f"query before delete by expr=`{expr}` -> result: \n-{result[0]}\n-{result[1]}\n")

    collection.delete(expr=f"id=={id}")


# Drop Collection
def drop_collection(collection_name: str):
    # print(fmt.format("Drop collection " + collection_name))
    utility.drop_collection(collection_name)


def db_init(dim):
    # create a connection
    create_connection()
    create_collections(dim)


if __name__ == '__main__':
    db_init(266)

# %%
