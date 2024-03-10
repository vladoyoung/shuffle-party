<script context="module" lang="ts" type="module">
    import { supabase } from '../supabase/client'

    export const handleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'spotify',
                options: {
                    scopes: 'user-library-read,playlist-modify-public,playlist-modify-private,playlist-read-private,playlist-read-collaborative,ugc-image-upload',
                    // For local use
                    // redirectTo: 'http://localhost:5173/',
                },
            })
            if (error) throw error
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
        }
    }
</script>
