import { getProviderToken } from '../stores/main'

async function checkIfUserHasShufflePartyPlaylist(
    userSpotifyId: string,
    signal?: AbortSignal
) {
    const providerToken = getProviderToken()
    try {
        let foundPlaylist = false
        let playlists: SpotifyApi.PlaylistBaseObject[] = []
        let nextUrl = `https://api.spotify.com/v1/users/${userSpotifyId}/playlists?limit=50`

        while (nextUrl && !foundPlaylist) {
            const response = await fetch(nextUrl, {
                headers: {
                    Authorization: 'Bearer ' + providerToken,
                },
                signal: signal,
            })
            const data = await response.json()
            playlists = playlists.concat(data.items)

            // Check if "Shuffle Party" playlist exists within current page of playlists
            const shufflePartyPlaylist = data.items.find(
                (playlist: SpotifyApi.PlaylistBaseObject) =>
                    playlist.name === 'Shuffle Party'
            )
            if (shufflePartyPlaylist) {
                foundPlaylist = true
                return shufflePartyPlaylist
            }

            nextUrl = data.next
        }

        return false
    } catch (error) {
        throw new Error('Error fetching playlists: ' + error)
    }
}

export default checkIfUserHasShufflePartyPlaylist
