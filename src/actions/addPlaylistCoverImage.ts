import type { Session } from '@supabase/supabase-js'
import ShufflePartyLogo from '../assets/shuffleparty_logo_512.jpg'

const addPlaylistCoverImage = async (
    playlistId: string,
    providerToken: Session['provider_token'],
    signal?: AbortSignal
) => {
    try {
        let base64Image = await fetch(ShufflePartyLogo)
            .then((response) => response.blob())
            .then((blob) => getBase64Image(blob))
            .then((base64) => base64.replace(/^data:image\/jpeg;base64,/, ''))

        await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/images`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/jpeg',
                    Authorization: `Bearer ${providerToken}`,
                },
                body: base64Image,
                signal: signal,
            }
        )
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.log('Fetch aborted')
        } else {
            throw new Error('Error adding playlist image: ' + error)
        }
    }
}

const getBase64Image = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })
}

export default addPlaylistCoverImage
