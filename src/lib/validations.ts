import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function authMiddleware(request: Request) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token no proporcionado' },
      { status: 401 }
    )
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch (error) {
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    )
  }
}

export const validateUsuario = (data: any) => {
  const errors: string[] = []
  
  if (!data.email?.includes('@')) {
    errors.push('Email inválido')
  }
  
  if (!data.nombre) {
    errors.push('El nombre es requerido')
  }
  
  if (data.password?.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres')
  }
  
  return errors
}
