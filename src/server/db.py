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
FIELDS = ["id", "speaker", "start", "end", "text", "episode", "embeddings"]

#### Connection
def create_connection():
    print(f"\nCreate connection...")
    connections.connect(host=HOST, port=PORT)
    print(f"\nList connections:")
    print(connections.list_connections())


def create_collections(dim=4):
    #
    podcast_fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
        FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="description", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="author", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="image", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="language", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="url", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="episodeCount", dtype=DataType.INT64),
        FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=1),
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
        FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=1),
    ]

    segment_fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="episode_id", dtype=DataType.INT64),
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="start", dtype=DataType.DOUBLE),
        FieldSchema(name="end", dtype=DataType.DOUBLE),
        FieldSchema(name="speaker", dtype=DataType.VARCHAR, max_length=10000),
        FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=dim),
    ]

    # Collection Schema
    podcast_schema = CollectionSchema(fields=podcast_fields, description="podcast")
    episode_schema = CollectionSchema(fields=episode_fields, description="episode")
    segment_schema = CollectionSchema(fields=segment_fields, enable_dynamic_field=True, auto_id=True, description="segment")


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
    index_id = {
        "index_type": "IVF_FLAT",
        "params": {"nlist": 4096}
    }

    # @TODO set index again
    #collection_podcast.create_index("id", index_id)
    #collection_episode.create_index("id", index_id)
    collection_segment.create_index("embeddings", index)


#### CRUD Operations
def get_collection_list():
    return(utility.list_collections())

# Get Transcription By FileId
def get_collection_data(collection_name:str, limit=10):
    collection = None
    if utility.has_collection(collection_name):
        collection = Collection(collection_name)
    else:
        print("Collection not available!")

    collection.load()
    result = collection.query(expr="", limit=limit, output_fields=FIELDS)

    return(result)

def get_item_by_id(collection_name:str, id):
    collection = None
    if utility.has_collection(collection_name):
        collection = Collection(collection_name)
    else:
        print("Collection not available!")

    # Query the collection by ID
    query_expr = f'id in [{id}]'
    query_result = collection.query(expr=query_expr)

    retrieved_item = None
    if query_result:
        # Extract the retrieved item
        retrieved_item = query_result[0]
        print("Item retrieved:", retrieved_item)
    else:
        print(f"No item found with ID {id} in the collection {collection_name}.")

    return retrieved_item


# Insert Transcription
def insert(collection_name, item):
    collection = Collection(collection_name)
    #db_item = get_item_by_id(collection_name, item.id)  # @TODO uncomment later
    #if not db_item:
    collection.insert(item)

    # After final entity is inserted, it is best to call flush to have no growing segments left in memory
    collection.flush()

    print(f"Number of entities in DB: {collection.num_entities}")


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

def delete_item_by_id(collection_name:str, id):
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
def drop_collection(collection_name:str):
    # print(fmt.format("Drop collection " + collection_name))
    utility.drop_collection(collection_name)

def db_init(dim):
    # create a connection
    create_connection()
    create_collections(dim)


if __name__ == '__main__':
    db_init(266)

#%%
