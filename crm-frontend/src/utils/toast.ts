import { toast, type ToastOptions } from 'react-toastify'

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
}

export const showSuccess = (message: string, options?: ToastOptions) =>
  toast.success(message, { ...defaultOptions, ...options })

export const showError = (message: string, options?: ToastOptions) =>
  toast.error(message, { ...defaultOptions, ...options })

export const showInfo = (message: string, options?: ToastOptions) =>
  toast.info(message, { ...defaultOptions, ...options })
