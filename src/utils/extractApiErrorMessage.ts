import { i18n } from '@/plugins/i18n'

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

  const finalMessage = message || defaultMessage

  // Intercept error messages from the backend that need translation
  const insufficientStockRegex = /^Estoque insuficiente para a matéria-prima '(.+?)' \((.+?)\)\. Necessário: ([\d.]+), Disponível: ([\d.]+)$/

  const match = finalMessage.match(insufficientStockRegex)
  if (match) {
    const [, name, code, required, available] = match
    // Usage of i18n global instance guarantees we use the active localized language
    return (i18n.global as any).t('backendErrors.insufficientStock', { name, code, required, available })
  }

  return finalMessage
}