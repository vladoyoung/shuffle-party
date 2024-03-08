<script lang="ts">
    import '../app.pcss'
    import { Toaster } from '$lib/components/ui/sonner'
</script>

<div class="align-center container flex min-h-screen flex-col justify-center">
    <slot />
    <Toaster />
</div>
