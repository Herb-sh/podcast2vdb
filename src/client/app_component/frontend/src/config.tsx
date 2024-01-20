export const BASE_URL = "http://127.0.0.1:8000";
export const PODCAST_SEARCH_URL = BASE_URL + "/v1/podcast/{podcast_name}";
export const EPISODE_LIST_URL = BASE_URL + "/v1/podcast/episodes/{podcast_id}";

export const EPISODE_TRANSCRIBE_URL = BASE_URL + "/v1/transcribe/episode/{episode_id}";

export const EPISODE_LIST_VDB_URL = "/v1/vdb/podcast/episodes/{podcast_id}"
export const EPISODE_VDB_URL = BASE_URL + "/v1/vdb/episode/{podcast_id}";