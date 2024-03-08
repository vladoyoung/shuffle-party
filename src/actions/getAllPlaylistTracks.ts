import { getProviderToken } from '../stores/main'

export async function getAllPlaylistTracks(
    playlistId: string,
    signal?: AbortSignal
) {
    const providerToken = getProviderToken()
    try {
        let allTracks: SpotifyApi.TrackObjectFull[] = []
        let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

        while (nextUrl) {
            const response = await fetch(nextUrl, {
                headers: {
                    Authorization: 'Bearer ' + providerToken,
                },
                signal: signal,
            })
            const data = await response.json()

            // Extracting track information from the response
            const tracks = data.items.map(
                (item: SpotifyApi.PlaylistTrackObject) => item.track
            )
            allTracks = allTracks.concat(tracks)

            nextUrl = data.next
        }

        return allTracks
    } catch (error) {
        console.error('Error:', error)
        return []
    }
}
