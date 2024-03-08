<script context="module" lang="ts" type="module">
    import { supabase } from '../supabase/client'
    export const updateProfile = async (
        userId: string,
        spotifyAccessToken: string,
        spotifyRefreshToken: string
    ) => {
        try {
            const updates = {
                id: userId,
                spotify_access_token: spotifyAccessToken,
                spotify_refresh_token: spotifyRefreshToken,
                updated_at: new Date().toISOString(),
            }

            const { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
        }
    }
</script>
