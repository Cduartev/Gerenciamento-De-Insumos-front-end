export const UNIDADES_MEDIDA = [
  { title: 'Unity', value: 'UNIDADE' },
  { title: 'Gram', value: 'GRAMA' },
  { title: 'Kilogram', value: 'QUILOGRAMA' },
  { title: 'Liter', value: 'LITRO' },
  { title: 'Milliliter', value: 'MILILITRO' },
]

export function getUnidadeMedidaTitle(enumValue: string): string {
  const unit = UNIDADES_MEDIDA.find((item) => item.value === enumValue)
  return unit ? unit.title : enumValue
}