export const BASE_URL = "http://127.0.0.1:8000";
export const PODCAST_SEARCH_URL = BASE_URL + "/v1/podcast/{podcast_name}";
export const EPISODE_LIST_URL = BASE_URL + "/v1/podcast/episodes/{podcast_id}";

export const EPISODE_TRANSCRIBE_URL = BASE_URL + "/v1/vdb/transcribe/episode/{episode_id}";

export const PODCAST_LIST_VDB_URL = BASE_URL + "/v1/vdb/podcasts"
export const EPISODE_LIST_VDB_URL = BASE_URL + "/v1/vdb/episode/{podcast_id}";
export const SEGMENT_LIST_VDB_URL = BASE_URL + "/v1/vdb/podcast/episode/{episode_id}/segments"