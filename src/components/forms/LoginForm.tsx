'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Guardar token y datos del usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      // Redireccionar al dashboard
      router.push('/dashboard');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <Input
        name="email"
        type="email"
        label="Email"
        required
        placeholder="tu@email.com"
      />
      
      <Input
        name="password"
        type="password"
        label="Contraseña"
        required
        placeholder="********"
      />

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <Button type="submit" isLoading={isLoading}>
        Iniciar sesión
      </Button>
    </form>
  );
} 