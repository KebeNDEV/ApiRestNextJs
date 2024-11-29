import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { hashPassword } from '@/lib/auth'
import { validatePassword } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.token || !body.password) {
      return NextResponse.json(
        { error: 'Token y nueva contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Validar contraseña
    const passwordErrors = validatePassword(body.password)
    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'La contraseña no cumple con los requisitos',
          details: passwordErrors
        },
        { status: 400 }
      )
    }

    // Buscar usuario con token válido
    const usuario = await prisma.usuario.findFirst({
      where: {
        resetPasswordToken: body.token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Actualizar contraseña
    const hashedPassword = await hashPassword(body.password)
    
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    })

    return NextResponse.json({
      message: 'Contraseña actualizada correctamente'
    })

  } catch (error) {
    console.error('Error en reset de contraseña:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
} 