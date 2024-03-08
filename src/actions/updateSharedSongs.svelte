<script context="module" lang="ts" type="module">
    import { supabase } from '../supabase/client'
    import { toast } from 'svelte-sonner'
    export const updateSharedSongs = async (
        userId: string,
        songs: SpotifyApi.TrackObjectSimplified[],
        signal: AbortSignal
    ) => {
        try {
            const updates = {
                id: userId,
                shared_songs: songs.map((tracks) => tracks.uri),
                updated_at: new Date().toISOString(),
            }

            const { error } = await supabase
                .from('profiles')
                .upsert(updates)
                .abortSignal(signal)
                .throwOnError()

            if (error) {
                throw error
            } else {
                toast.success('Shared songs updated!')
            }
        } catch (error) {
            if (signal.aborted) {
                toast.error('Shared songs update aborted!')
            } else {
                toast.error(
                    (error as Error).message ||
                        'Failed to update shuffled songs'
                )
            }
        }
    }
</script>
