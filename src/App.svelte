<script lang="ts">
    import { onMount } from 'svelte'
    import { supabase } from './supabase/client'
    import type { AuthSession } from '@supabase/supabase-js'
    import Auth from './lib/Auth.svelte'
    import { handleLogin } from './actions/handleLogin.svelte'
    import { setProviderToken } from './stores/main'
    import Layout from '$lib/Layout.svelte'
    import Dashboard from '$lib/Dashboard.svelte'

    let session: AuthSession | null

    onMount(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session && !data.session?.provider_token) {
                console.log('Token not present or expired, relogging')
                handleLogin()
            }
        })

        supabase.auth.onAuthStateChange((event, _session) => {
            session = _session
            setProviderToken(_session?.provider_token)
        })
    })
</script>

<Layout>
    {#if !session}
        <Auth />
    {:else}
        <Dashboard {session} />
    {/if}
</Layout>
