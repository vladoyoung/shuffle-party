<script lang="ts">
    import { onMount } from 'svelte'
    import type { AuthSession } from '@supabase/supabase-js'
    import { updateSharedSongs } from '../actions/updateSharedSongs.svelte'
    import { fetchTracks } from '../actions/fetchTracks.svelte'
    import { getAllPlaylistTracks } from '../actions/getAllPlaylistTracks'
    import { removeTracksFromPlaylist } from '../actions/removeTracksFromPlaylist'
    import createPlaylist from '../actions/createPlaylist'
    import addItemsToPlaylist from '../actions/addItemsToPlaylist'
    import checkIfUserHasShufflePartyPlaylist from '../actions/checkIfUserHasShufflePartyPlaylist'
    import changePlaylistDetails from '../actions/changePlaylistDetails'
    import addPlaylistCoverImage from '../actions/addPlaylistCoverImage'
    import getProfiles from '../actions/getProfiles'
    import { Button } from '$lib/components/ui/button'
    import * as Avatar from '$lib/components/ui/avatar'
    import * as Card from '$lib/components/ui/card'
    import { Loader2, CheckCircle2 } from 'lucide-svelte'
    import Account from './Account.svelte'
    import { Skeleton } from '$lib/components/ui/skeleton'
    import { toast } from 'svelte-sonner'
    import arraysAreIdentical from '../utils/arraysAreIdentical'
    import arrayMixer from '../utils/arrayMixer'
    import { Confetti } from 'svelte-confetti'

    export let session: AuthSession

    type User = {
        id: string
        full_name: string
        avatar_url: string
        updated_at: string
        shared_songs: string[]
    }

    let loading = false
    let mixingCompleted = false
    let playlistId: string | null = null
    let fetchedTracks: SpotifyApi.TrackObjectSimplified[] = []
    let abortController: AbortController
    let users: User[] = []

    let selectedUser: User | null = null

    onMount(() => {
        getProfiles(session).then(({ data }) => {
            users = data || []
        })
    })

    async function startMixingClick() {
        try {
            mixingCompleted = false
            loading = true
            if (!selectedUser) {
                toast.error('Please select a user to party with')
                return
            }
            abortController = new AbortController()
            const signal = abortController.signal
            fetchedTracks = await fetchTracks(signal)
            const hasExistingShufflePartyPlaylist =
                await checkIfUserHasShufflePartyPlaylist(
                    session.user.user_metadata.provider_id
                )
            if (!hasExistingShufflePartyPlaylist) {
                const newPlaylistInfo = await createPlaylist()
                playlistId = newPlaylistInfo.id
                if (playlistId) {
                    if (fetchedTracks.length > 0) {
                        const songUris = fetchedTracks.map((track) => track.uri)
                        if (selectedUser.shared_songs.length > 0) {
                            const mixedPlaylist = arrayMixer(
                                songUris,
                                selectedUser.shared_songs
                            )
                            await addItemsToPlaylist(playlistId, mixedPlaylist)
                        } else {
                            await addItemsToPlaylist(playlistId, songUris)
                        }
                    } else {
                        throw new Error('No loaded tracks to mix.')
                    }
                    // Delay because Spotify API doesn't recognise the playlist immediately
                    if (playlistId) {
                        setTimeout(async () => {
                            await addPlaylistCoverImage(
                                playlistId!,
                                session.provider_token
                            )
                        }, 1000)
                    }
                }
            } else {
                // Not creating a new playlist, user already has a Shuffle Party playlist
                playlistId = hasExistingShufflePartyPlaylist.id
                if (playlistId) {
                    if (fetchedTracks.length > 0) {
                        const fetchedTracksUris = fetchedTracks.map(
                            (track) => track.uri
                        )
                        const playlistTracks =
                            await getAllPlaylistTracks(playlistId)
                        const playlistSongsUris = playlistTracks.map(
                            (track) => track.uri
                        )
                        if (
                            arraysAreIdentical(
                                arrayMixer(
                                    fetchedTracksUris,
                                    selectedUser.shared_songs
                                ),
                                playlistSongsUris
                            )
                        ) {
                            toast.error(
                                'The songs you are trying to mix are the same as the current ones!'
                            )
                            return
                        } else {
                            await removeTracksFromPlaylist(
                                playlistId,
                                playlistTracks
                            )
                            if (selectedUser.shared_songs.length > 0) {
                                const mixedPlaylist = arrayMixer(
                                    fetchedTracksUris,
                                    selectedUser.shared_songs
                                )
                                await addItemsToPlaylist(
                                    playlistId,
                                    mixedPlaylist
                                )
                            } else {
                                await addItemsToPlaylist(
                                    playlistId,
                                    fetchedTracksUris
                                )
                            }
                            await changePlaylistDetails(playlistId)
                        }
                    } else {
                        throw new Error('No loaded tracks to mix.')
                    }
                }
            }
            mixingCompleted = true
        } catch (error) {
            toast.error('Something went wrong while mixing: ' + error)
        } finally {
            loading = false
        }
    }

    function abortShuffle() {
        if (abortController) {
            abortController.abort('Shuffle aborted by user')
            loading = false
        }
    }

    function userSelectClick(userId: User) {
        selectedUser = userId
    }

    async function updateSharedSongsClick() {
        try {
            loading = true
            abortController = new AbortController()
            const signal = abortController.signal
            const tracks = await fetchTracks(signal)

            if (tracks.length > 0) {
                await updateSharedSongs(session.user.id, tracks, signal)
            }
        } catch (error) {
            toast.error('Error fetching tracks: ' + error)
        } finally {
            loading = false
        }
    }
</script>

<Account {session} />

<div
    class="flex flex-col items-center justify-center gap-8 pb-4 pt-16 text-center">
    {#if !mixingCompleted}
        <h2 class="mx-auto max-w-max text-xl font-semibold sm:text-2xl">
            🎉 &nbsp; Select a user to party with...
        </h2>
        <div class="flex flex-row flex-wrap items-center justify-center gap-4">
            {#if users.length > 0}
                {#each users as user}
                    <button on:click={() => userSelectClick(user)}>
                        <Card.Root
                            class={`relative w-44 max-w-44 transition-all duration-100 ease-in-out ${selectedUser?.id === user.id ? 'border-[var(--border)]' : ''}`}>
                            <Card.Header
                                class="align-center flex flex-row justify-center">
                                <Avatar.Root class="h-14 w-14">
                                    {#if user.avatar_url}
                                        <Avatar.Image
                                            src={user.avatar_url}
                                            alt={user.full_name} />
                                    {:else}
                                        <Avatar.Fallback
                                            >{user.full_name.charAt(
                                                0
                                            )}</Avatar.Fallback>
                                    {/if}
                                </Avatar.Root>
                            </Card.Header>
                            <Card.Content class="pb-0">
                                {user.full_name}
                            </Card.Content>
                            <Card.Footer>
                                <span
                                    class="text-balance text-xs text-muted-foreground"
                                    >Last updated: {new Date(
                                        user.updated_at
                                    ).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}</span>
                            </Card.Footer>
                            <div
                                class={`absolute right-2 top-2 transition-opacity duration-100 ease-in-out ${selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'}`}>
                                <CheckCircle2 class="w-5" />
                            </div>
                        </Card.Root>
                    </button>
                {/each}
            {:else}
                <Skeleton class="h-[186px] w-44" />
                <Skeleton class="h-[186px] w-44" />
                <Skeleton class="h-[186px] w-44" />
            {/if}
        </div>

        {#if selectedUser}
            <div class="flex h-20 flex-col items-center justify-start gap-2">
                <Button
                    disabled={loading}
                    on:click={() => {
                        startMixingClick()
                    }}>
                    {#if loading}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                    {/if}
                    {loading ? 'Mixing...' : 'Start party mixing'}
                </Button>
                {#if loading}
                    <Button
                        variant="destructive"
                        on:click={() => {
                            abortShuffle()
                        }}>
                        Abort mixing
                    </Button>
                {/if}
            </div>
        {/if}

        {#if !selectedUser}
            <div class="flex h-20 flex-col gap-2">
                <span class="text-sm text-muted-foreground">or</span>
                <Button
                    disabled={loading}
                    variant="secondary"
                    on:click={() => {
                        updateSharedSongsClick()
                    }}>
                    {#if loading}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                    {/if}
                    {loading ? 'Updating...' : 'Update your shared songs'}
                </Button>
                {#if loading}
                    <Button
                        variant="destructive"
                        on:click={() => {
                            abortShuffle()
                        }}>
                        Abort updating
                    </Button>
                {/if}
            </div>
        {/if}
    {:else}
        <div
            class="flex flex-col items-center justify-center gap-2 text-center">
            <h2 class="text-4xl font-bold sm:text-5xl md:text-7xl lg:text-8xl">
                Mix completed!
            </h2>
            <h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Lets get this party started!
            </h3>
            <Button
                href={`https://open.spotify.com/playlist/${playlistId}?go=1&amp`}
                target="_blank"
                size="lg"
                class="mt-4">Open playlist</Button>
        </div>
        <div
            class="pointer-events-none fixed left-0 top-[-50px] flex h-screen w-screen justify-center overflow-hidden">
            <Confetti
                x={[-5, 5]}
                y={[0, 0.1]}
                delay={[500, 2000]}
                infinite
                duration={5000}
                amount={200}
                fallDistance="100vh" />
        </div>
    {/if}
</div>
