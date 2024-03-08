<script lang="ts">
    import { handleLogin } from '../actions/handleLogin.svelte'
    import { Button } from '$lib/components/ui/button'
    import { Confetti } from 'svelte-confetti'
</script>

<div class="flex flex-col items-center justify-center gap-2 text-center">
    <h2 class="flex text-4xl font-bold sm:text-5xl md:text-7xl lg:text-8xl">
        <Confetti infinite x={[-1, -0.25]} y={[0, 0.5]} />
        Shuffle Party
        <Confetti infinite x={[0.25, 1]} y={[0, 0.5]} />
    </h2>
    <h3 class="text-md sm:text-lg md:text-xl lg:text-2xl">
        Save time and shuffle your liked songs!
    </h3>
    <Button on:click={handleLogin} target="_blank" size="lg" class="mt-4"
        >Log in with spotify</Button>
</div>
