import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import bcrypt from 'bcrypt'
import { generateToken } from '@/lib/auth'
import { Prisma } from '@prisma/client'

interface UsuarioWithPassword {
    id: number
    nombre: string
    email: string
    password: string
    rol: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email y password son requeridos' },
        { status: 400 }
      )
    }

    const usuario = await prisma.$queryRaw<UsuarioWithPassword[]>`
      SELECT id, nombre, email, password, rol 
      FROM Usuario 
      WHERE email = ${body.email} 
      LIMIT 1
    `

    if (!usuario || usuario.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const passwordValido = await bcrypt.compare(body.password, usuario[0].password)
    if (!passwordValido) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const token = generateToken(usuario[0].id)

    return NextResponse.json({
      message: 'Login exitoso',
      usuario: {
        id: usuario[0].id,
        nombre: usuario[0].nombre,
        email: usuario[0].email,
        rol: usuario[0].rol
      },
      token
    })

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}
