<script lang="ts">
    import type { AuthSession } from '@supabase/supabase-js'
    import { supabase } from '../supabase/client'
    import { Button } from '$lib/components/ui/button'
    import * as Avatar from '$lib/components/ui/avatar'
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
    import LogOut from 'lucide-svelte/icons/log-out'

    export let session: AuthSession

    async function signOut() {
        await supabase.auth.signOut()
    }
</script>

<div class="absolute right-4 top-4">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
            <Button
                builders={[builder]}
                variant="ghost"
                class="flex flex-row gap-2"
            >
                <Avatar.Root class="h-6 w-6">
                    {#if session.user.user_metadata.avatar_url}
                        <Avatar.Image
                            src={session.user.user_metadata.avatar_url}
                            alt={session.user.user_metadata.full_name}
                        />
                    {:else}
                        <Avatar.Fallback
                            >{session.user.user_metadata.full_name.charAt(
                                0
                            )}</Avatar.Fallback
                        >
                    {/if}
                </Avatar.Root>
                {session.user.user_metadata.full_name}
            </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
            <DropdownMenu.Label>My Account</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
                on:click={() => signOut()}
                class="cursor-pointer"
            >
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>
