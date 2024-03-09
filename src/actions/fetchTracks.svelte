<script context="module" lang="ts" type="module">
    import { getProviderToken } from '../stores/main'
    import { toast } from 'svelte-sonner'
    const songsToGet = 25
    export async function fetchTracks(signal: AbortSignal) {
        const tracks = []
        const providerToken = getProviderToken()
        try {
            const response = await fetch(
                'https://api.spotify.com/v1/me/tracks?limit=1',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${providerToken}`,
                    },
                    signal: signal, // Associate the signal with the fetch request
                }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch tracks')
            }

            const { total } = await response.json()

            // If the total number of liked songs is less than the number of songs to get, return an empty array
            if (total < songsToGet) {
                toast.error(
                    'You have less liked songs than the number of songs to get'
                )
                throw new Error('Less liked songs than songs to get')
            }
            // If the total number of liked songs is less than or equal to 50, we can get all liked songs in one request
            if (total <= 50 && total === songsToGet) {
                const response = await fetch(
                    `https://api.spotify.com/v1/me/tracks?limit=${songsToGet}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${providerToken}`,
                        },
                        signal: signal,
                    }
                )
                if (!response.ok) {
                    toast.error('Failed to fetch tracks. Try again later')
                    throw new Error('Failed to fetch tracks by limit')
                }
                const { items } = await response.json()
                tracks.push(items.map((item: any) => item.track))
                return tracks[0]
            }
            const randomTrackIndices = getRandomTrackIndices(total)

            for (const index of randomTrackIndices) {
                const offset = index > 0 ? index - 1 : 0 // Adjust offset to start from 0
                const trackResponse = await fetch(
                    `https://api.spotify.com/v1/me/tracks?limit=1&offset=${offset}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${providerToken}`,
                        },
                        signal: signal,
                    }
                )

                if (!trackResponse.ok) {
                    toast.error('Failed to fetch a track. Try again later')
                    throw new Error(`Failed to fetch track at offset ${offset}`)
                }

                const { items } = await trackResponse.json()
                tracks.push(items[0].track)
            }

            return tracks
        } catch (error) {
            throw new Error('Failed to fetch tracks' + error)
        }
    }

    // Function to generate X unique random track indices
    function getRandomTrackIndices(totalTracks: number) {
        const randomIndices: number[] = []
        while (randomIndices.length < songsToGet) {
            const randomIndex = Math.floor(Math.random() * totalTracks)
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex)
            }
        }
        return randomIndices
    }
</script>
