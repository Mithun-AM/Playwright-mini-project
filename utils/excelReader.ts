
import * as XLSX from 'xlsx';
import * as path from 'path';

export function readExcel(filepath: string, sheetName: string): any[] {

    const fullPath = path.resolve(filepath);
    const workBook = XLSX.readFile(fullPath);

    const sheet = workBook.Sheets[sheetName];

    if (!sheet) {
        throw new Error(`Worksheet "${sheetName}" not found in Excel file`);
    }

    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
}
