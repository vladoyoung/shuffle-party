import { getProviderToken } from '../stores/main'

export async function removeTracksFromPlaylist(
    playlistId: string,
    tracksURIs: any[],
    signal?: AbortSignal
) {
    const providerToken = getProviderToken()
    try {
        const removeResponse = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + providerToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tracks: tracksURIs.map((track) => ({ uri: track.uri })),
                }),
                signal: signal,
            }
        )

        if (!removeResponse.ok) {
            throw new Error('Failed to remove tracks from the playlist')
        }

        return true // Indicate successful removal
    } catch (error) {
        throw new Error('Error removing tracks from the playlist: ' + error)
    }
}
