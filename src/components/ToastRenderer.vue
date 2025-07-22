<script setup lang="ts">
import {
	ToasterStore,
	type ToastOptions,
	type ToastType,
} from '#stores/toaster'

const toastStatusClassMap: Record<ToastType, string> = {
	warning: 'warning',
	error: 'error',
	success: 'success',
	info: 'info',
}

const toastStore = ToasterStore()

function getIconSrc(toast: ToastOptions) {
	switch (toast.status) {
		case 'error':
			return '/errorCircle.svg'
		case 'warning':
			return '/warningCircle.svg'
		case 'success':
			return '/successCircle.svg'
		default:
			return '/infoCircle.svg'
	}
}
</script>

<template>
	<Teleport to="body">
		<ul
			v-if="toastStore.toasts.length"
			class="toastContainer fixed z-36 flex flex-col gap-4"
		>
			<li
				v-for="(toast, index) in toastStore.toasts"
				@click="toastStore.removeToast(toast.id)"
				class="toast flex items-center gap-2 p-4"
				:class="[[toastStatusClassMap[toast.status]]]"
				:key="index"
			>
				<img
					:title="toast.status"
					:alt="`Icon for the following ${toast.status}`"
					:src="getIconSrc(toast)"
					width="25"
					height="25"
					loading="lazy"
				/>

				<span class="font-400 color-white text-size-base">
					{{ toast.text }}
				</span>
			</li>
		</ul>
	</Teleport>
</template>

<style scoped lang="css">
img {
	border-radius: 16px;
	background-color: var(--tertiaryColor);
}

.toastContainer {
	bottom: 3%;
	right: 5%;
}

.toast {
	border-radius: 0.5rem;
	border: 1px solid transparent;
	background-color: var(--primaryColor);
	border-color: var(--secondaryColor);
}

.success {
	--primaryColor: #3a9c2b;
	--secondaryColor: #68e84e;
	--tertiaryColor: black;
}

.info {
	--primaryColor: #a3a3a3;
	--secondaryColor: #e8e8e8;
	--tertiaryColor: white;
}

.error {
	--primaryColor: #9c2b2e;
	--secondaryColor: #e84e4f;
	--tertiaryColor: white;
}

.warning {
	--primaryColor: #9c9a2b;
	--secondaryColor: #dee84e;
	--tertiaryColor: black;
}
</style>
