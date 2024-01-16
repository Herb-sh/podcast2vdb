interface SoundBite {
    startTime: number,
    duration: number,
    title: string
}
export interface Episode {
        id: number,
        title: string,
        link: string,
        description: string,
        guid: string,
        datePublished: number,
        datePublishedPretty: string,
        dateCrawled: number,
        enclosureUrl: string,
        enclosureType: string, // "audio/mpeg",
        enclosureLength: number,
        duration: number,
        explicit: number,
        episode: number,
        episodeType: string,
        season: number,
        image: string,
        feedItunesId: number,
        feedImage: string,
        feedId: number,
        feedLanguage:string, // "de",
        feedDead: number,
        feedDuplicateOf?: string,
        chaptersUrl?: string,
        transcriptUrl?: string,
        soundbite?: SoundBite,
        soundbites?: Array<SoundBite>
}