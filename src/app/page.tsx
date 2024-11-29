import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido</h1>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="text-blue-500 hover:text-blue-700"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
