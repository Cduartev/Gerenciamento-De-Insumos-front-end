export function extrairMensagemErroApi(error: any, defaultMessage = 'An unexpected error occurred.'): string {
  const response = error?.response?.data

  if (!response) {
    return error?.message || defaultMessage
  }

  const message = response.mensagem || response.message
  const details = Array.isArray(response.detalhes) ? response.detalhes : []

  if (details.length > 0) {
    return `${message || 'Request error.'} ${details.join(' | ')}`
  }

  return message || defaultMessage
}