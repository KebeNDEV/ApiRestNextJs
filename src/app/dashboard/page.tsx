'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const usuarioData = localStorage.getItem('usuario');
      if (usuarioData) {
        setUsuario(JSON.parse(usuarioData));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {usuario.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-900"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Información del usuario</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="mt-1">{usuario.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{usuario.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rol</p>
                <p className="mt-1">{usuario.rol}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 