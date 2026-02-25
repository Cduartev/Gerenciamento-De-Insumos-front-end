export const UNIDADES_MEDIDA = [
  { title: 'Unity', value: 'UNIT' },
  { title: 'Gram', value: 'GRAM' },
  { title: 'Kilogram', value: 'KILOGRAM' },
  { title: 'Liter', value: 'LITER' },
  { title: 'Milliliter', value: 'MILLILITER' },
]

export function getUnidadeMedidaTitle(enumValue: string): string {
  const unit = UNIDADES_MEDIDA.find((item) => item.value === enumValue)
  return unit ? unit.title : enumValue
}