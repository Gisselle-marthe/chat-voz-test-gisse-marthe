import Swal from "sweetalert2"
import { tr } from "vuetify/locale"

export type ToastType = "success" | "error" | "warning" | "info"

export function useToast() {
  function showToast(options: any) {
    const defaultOptions = {
      position: "top-end",
      showConfirmButton: false,
      toast: true,
      timer: 3000,
      timerProgressBar: true,
    }

    const finalOptions = {
      ...defaultOptions,
      ...options,
    }

    return Swal.fire(finalOptions)
  }

  function success(message: string, title?: string) {
    return showToast({
      title,
      text: message,
      icon: "success",
      confirmButtonColor: "#4CAF50",
    })
  }

  function error(message: string, title?: string) {
    return showToast({
      title,
      text: message,
      icon: "error",
      confirmButtonColor: "#F44336",
    })
  }

  function warning(message: string, title?: string) {
    return showToast({
      title,
      text: message,
      icon: "warning",
      confirmButtonColor: "#FF9800",
    })
  }

  function info(message: string, title?: string) {
    return showToast({
      title,
      text: message,
      icon: "info",
      confirmButtonColor: "#2196F3",
    })
  }

  function audioEmpty() {
    return showToast({
      title: "Audio Vacío",
      html: '<div class="audio-icon-microphone"></div><div class="toast-text">No hay audio grabado para enviar. Graba un mensaje de voz primero.</div>',
      icon: undefined,
      confirmButtonColor: "#FF9800",
    })
  }

  function audioSilent() {
    return showToast({
      title: "Audio en Silencio",
      html: '<div class="audio-icon-microphone-off"></div><div class="toast-text">El audio está en silencio. Intenta grabar de nuevo hablando más fuerte.</div>',
      icon: undefined,
      confirmButtonColor: "#FF9800",
    })
  }

  function audioTooShort() {
    return showToast({
      title: "Audio Muy Corto",
      html: '<div class="audio-icon-clock"></div><div class="toast-text">El audio es demasiado corto. Debe tener al menos 0.5 segundos.</div>',
      icon: undefined,
      confirmButtonColor: "#FF9800",
    })
  }

  function audioSendFailed() {
    return showToast({
      title: "Error al Enviar",
      html: '<div class="audio-icon-send-failed"></div><div class="toast-text">Falló el envío del audio. Intenta de nuevo.</div>',
      icon: undefined,
      confirmButtonColor: "#F44336",
    })
  }

  function audioRecordingFailed() {
    return showToast({
      title: "Error de Grabación",
      html: '<div class="audio-icon-microphone-off"></div><div class="toast-text">Error al grabar el audio. Verifica los permisos del micrófono.</div>',
      icon: undefined,
      confirmButtonColor: "#F44336",
    })
  }

  function audioPermissionDenied() {
    return showToast({
      title: "Permiso Denegado",
      html: '<div class="audio-icon-lock"></div><div class="toast-text">Permiso de micrófono denegado. Habilita el micrófono en tu navegador.</div>',
      icon: undefined,
      confirmButtonColor: "#F44336",
    })
  }

  function audioProcessingError() {
    return showToast({
      title: "Error de Procesamiento",
      html: '<div class="audio-icon-error"></div><div class="toast-text">Error al procesar el audio. Intenta grabar de nuevo.</div>',
      icon: undefined,
      confirmButtonColor: "#F44336",
    })
  }

  function audioValidationError() {
    return showToast({
      title: "Audio Inválido",
      html: '<div class="audio-icon-alert"></div><div class="toast-text">El audio no cumple con los requisitos mínimos. Graba un mensaje más largo.</div>',
      icon: undefined,
      confirmButtonColor: "#FF9800",
    })
  }

  function confirm(options: {
    title: string
    text: string
    confirmButtonText?: string
    cancelButtonText?: string
    confirmButtonColor?: string
  }) {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: options.confirmButtonColor || "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: options.confirmButtonText || "Confirmar",
      cancelButtonText: options.cancelButtonText || "Cancelar",
    })
  }

  function audioSentSuccessfully() {
    return showToast({
      title: "¡Enviado!",
      html: '<div class="audio-icon-send-success"></div><div class="toast-text">Mensaje de voz enviado correctamente</div>',
      icon: undefined,
      confirmButtonColor: "#4CAF50",
    })
  }

  function audioRecordingStarted() {
    return showToast({
      title: "Grabando...",
      html: '<div class="audio-icon-microphone-recording"></div><div class="toast-text">Grabación iniciada. Habla ahora.</div>',
      icon: undefined,
      confirmButtonColor: "#2196F3",
    })
  }

  function audioRecordingStopped() {
    return showToast({
      title: "Grabación Completada",
      html: '<div class="audio-icon-microphone-stop"></div><div class="toast-text">Grabación detenida. Procesando audio...</div>',
      icon: undefined,
      confirmButtonColor: "#4CAF50",
    })
  }

  function audioPaused() {
    return showToast({
      title: "Grabación Pausada",
      html: '<div class="audio-icon-pause"></div><div class="toast-text">Grabación pausada. Haz clic en play para continuar.</div>',
      icon: undefined,
      confirmButtonColor: "#2196F3",
    })
  }

  function audioResumed() {
    return showToast({
      title: "Grabación Reanudada",
      html: '<div class="audio-icon-play"></div><div class="toast-text">Grabación reanudada. Continúa grabando.</div>',
      icon: undefined,
      confirmButtonColor: "#4CAF50",
    })
  }

  function audioCancelled() {
    return showToast({
      title: "Grabación Cancelada",
      html: '<div class="audio-icon-delete"></div><div class="toast-text">Grabación cancelada. El audio no se guardará.</div>',
      icon: undefined,
      confirmButtonColor: "#FF9800",
    })
  }

  function audioPauseFailed() {
    return showToast({
      title: "Error al Pausar",
      html: '<div class="audio-icon-error"></div><div class="toast-text">Error al pausar la grabación. Intenta de nuevo.</div>',
      icon: undefined,
      confirmButtonColor: "#F44336",
    })
  }

  function audioResumeFailed() {
    return showToast({
      title: "Error al Reanudar",
      html: '<div class="audio-icon-error"></div><div class="toast-text">Error al reanudar la grabación. Intenta de nuevo.</div>',
      icon: undefined,
      confirmButtonColor: "#F44336",
    })
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
    confirm,

    audioEmpty,
    audioSilent,
    audioTooShort,
    audioSendFailed,
    audioRecordingFailed,
    audioPermissionDenied,
    audioProcessingError,
    audioValidationError,
    audioSentSuccessfully,
    audioRecordingStarted,
    audioRecordingStopped,
    audioPaused,
    audioResumed,
    audioCancelled,
    audioPauseFailed,
    audioResumeFailed,
  }
}
