<script lang="ts">
    import '../app.pcss'
    import { Toaster } from '$lib/components/ui/sonner'
</script>

<div class="align-center container flex flex-col justify-center overflow-hidden min-h-svh">
    <slot />
    <Toaster />
</div>
