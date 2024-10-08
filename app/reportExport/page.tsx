"use client"


import { usePDF } from 'react-to-pdf'

const sampleData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Developer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Tester" },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "DevOps" },
]

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children }:ButtonProps) => (
  <button
    onClick={onClick}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  >
    {children}
  </button>
)

export default function Component() {
  const { toPDF, targetRef } = usePDF({filename: 'table-data.pdf'});

  return (
    <div className="container mx-auto p-4">
      <div ref={targetRef}>
        <div className="flex items-center justify-between mb-8">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="h-15"
          />
          <h1 className="text-2xl font-bold">Employee Data</h1>
        </div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{employee.name}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{employee.email}</td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{employee.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Button onClick={() => toPDF()}>Export to PDF</Button>
      </div>
    </div>
  )
}