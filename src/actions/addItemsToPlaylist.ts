import { getProviderToken } from '../stores/main'

const addItemsToPlaylist = async (playlistId: string, tracks: string[], signal?: AbortSignal) => {
    const providerToken = getProviderToken()
    try {
        const snapshot = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/items`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${providerToken}`,
                },
                body: JSON.stringify({
                    uris: tracks,
                    position: 0,
                }),
                signal: signal,
            }
        )
        return snapshot.json()
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.log('Fetch aborted')
        } else {
            throw new Error('Error fetching tracks: ' + error)
        }
        return []
    }
}

export default addItemsToPlaylist
