import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Aplicación',
  description: 'Aplicación con autenticación',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
