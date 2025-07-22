import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface ToastOptions {
	text: string
	status?: ToastType
	timeout?: number
}

interface Toast {
	text: string
	status: ToastType
	id: number
}

const defaultTimeout = 3000

function getRandomInt() {
	return Math.floor(Math.random() * 1000000)
}

export const ToasterStore = defineStore('toaster-store', () => {
	const toasts = ref<Toast[]>([])

	function getToastById(toastId: number) {
		return toasts.value.findIndex((toast) => toast.id === toastId)
	}

	function updateState(options: ToastOptions) {
		const toastId = getRandomInt()

		toasts.value.push({
			text: options.text,
			status: options.status ?? 'info',
			id: toastId,
		})

		setTimeout(() => {
			toasts.value.splice(getToastById(toastId), 1)
		}, options.timeout ?? defaultTimeout)
	}

	function newToast(options: ToastOptions) {
		updateState(options)
	}

	function removeToast(toastId: number) {
		toasts.value.splice(getToastById(toastId), 1)
	}

	return { toasts, newToast, removeToast }
})
