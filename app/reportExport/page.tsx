"use client"

import { useState } from 'react'
import { FileSpreadsheet, File  } from 'lucide-react'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import autoTable from 'jspdf-autotable'

export default function ReportGenerator() {
  const [data] = useState([
    { id: 1, name: 'John Doe', sales: 5000 },
    { id: 2, name: 'Jane Smith', sales: 6200 },
    { id: 3, name: 'Bob Johnson', sales: 4800 },
    { id: 4, name: 'Alice Brown', sales: 5500 },
    { id: 5, name: 'Charlie Davis', sales: 7000 },
  ])

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report")
    XLSX.writeFile(wb, "sales_report.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Load the logo image
    const img = new Image()
    img.src = '/logo.png'
    img.onload = () => {
      // Add the logo to the PDF
      doc.addImage(img, 'PNG', 10, 10, 50, 20)

      // Add the table after the logo
      doc.autoTable({
        startY: 40, // Adjust startY to position the table below the logo
        head: [['ID', 'Name', 'Sales']],
        body: data.map(item => [item.id, item.name, item.sales]),
      })

      doc.save('sales_report.pdf')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
          <img src="/logo.png" alt="Company Logo" className="h-10 w-10" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b text-right">Sales</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.id}</td>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b text-right">${item.sales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export to Excel</span>
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <File className="h-4 w-4" />
            <span>Export to PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}