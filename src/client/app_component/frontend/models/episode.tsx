class SoundBite {
    public startTime: number;
    public duration: number;
    public title: string;
}
export class Episode {
        public id: number;
        public title: string;
        public link: string;
        public description: string;
        public guid: string;
        public datePublished: number;
        public datePublishedPretty: string;
        public dateCrawled: number;
        public enclosureUrl: string;
        public enclosureType: string; // "audio/mpeg",
        public enclosureLength: number;
        public duration: number;
        public explicit: number;
        public episode: number;
        public episodeType: string;
        public season: number;
        public image: string;
        public feedItunesId: number;
        public feedImage: string;
        public feedId: number;
        public feedLanguage:string; // "de",
        public feedDead: number;
        public feedDuplicateOf?: string;
        public chaptersUrl?: string;
        public transcriptUrl?: string;
        public soundbite?: SoundBite;
        public soundbites?: Array<SoundBite>;
}

export class EpisodeExtended extends Episode {
    public isTranscribed: boolean;
}