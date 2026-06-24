<script lang="ts">
	import type { AppID } from '$lib/state/apps.svelte';

	const {
		app_id,
		is_being_dragged,
	}: {
		app_id: AppID;
		is_being_dragged: boolean;
	} = $props();
</script>

{#if app_id === 'calendar'}
	{#await import('./Calendar/Calendar.svelte') then { default: Calendar }}
		<Calendar />
	{/await}
{:else if app_id === 'vscode'}
	{#await import('./VSCode/VSCode.svelte') then { default: VSCode }}
		<VSCode {is_being_dragged} />
	{/await}
{:else if app_id === 'calculator'}
	{#await import('./Calculator/Calculator.svelte') then { default: Calculator }}
		<Calculator />
	{/await}
{:else if app_id === 'wallpapers'}
	{#await import('./WallpaperApp/WallpaperSelectorApp.svelte') then { default: WallpaperSelector }}
		<WallpaperSelector />
	{/await}
{:else if app_id === 'about-archmac'}
	{#await import('./AboutArchMac/AboutArchMac.svelte') then { default: AboutArchMac }}
		<AboutArchMac />
	{/await}
{:else if app_id === 'install'}
	{#await import('../Installer/Installer.svelte') then { default: Installer }}
		<Installer />
	{/await}
{:else if app_id === 'system-preferences'}
	{#await import('./SystemSettings/SystemSettings.svelte') then { default: SystemSettings }}
		<SystemSettings />
	{/await}
{:else if app_id === 'appstore'}
	{#await import('./AppStore/AppStore.svelte') then { default: AppStore }}
		<AppStore {app_id} />
	{/await}
{:else}
	{#await import('./Placeholder/PlaceholderApp.svelte') then { default: PlaceholderApp }}
		<PlaceholderApp {app_id} />
	{/await}
{/if}
