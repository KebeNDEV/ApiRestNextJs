import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { hashPassword } from '@/lib/auth'
import { Prisma } from '@prisma/client'

interface CreateUsuarioInput {
    nombre: string
    email: string
    password: string
    rol?: string
    updatedAt?: Date
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.nombre || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Nombre, email y password son requeridos' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(body.password)

    const createData: CreateUsuarioInput = {
      nombre: body.nombre,
      email: body.email,
      password: hashedPassword,
      rol: 'usuario',
      updatedAt: new Date()
    }

    const usuario = await prisma.usuario.create({
      data: createData as any
    })

    const usuarioResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    }

    return NextResponse.json({ 
      message: 'Usuario creado correctamente',
      usuario: usuarioResponse
    }, { status: 201 })

  } catch (error) {
    console.error('Error en registro:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 }
    )
  }
} 