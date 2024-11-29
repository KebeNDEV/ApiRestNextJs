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

export const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres')
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula')
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra minúscula')
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('La contraseña debe contener al menos un número')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('La contraseña debe contener al menos un carácter especial')
    }
    
    return errors
}
