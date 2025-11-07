import { Parser } from 'json2csv'
import * as XLSX from 'xlsx'

export function exportToCSV<T extends Record<string, any>>(data: T[], fields: string[]): string {
  const parser = new Parser({ fields })
  return parser.parse(data)
}

export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  sheetName: string = 'Datos'
): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  return buffer
}
