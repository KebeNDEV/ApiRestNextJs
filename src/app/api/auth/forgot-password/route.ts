import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Configurar el transportador de email (ajusta con tus credenciales)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface ResetPasswordData {
  resetPasswordToken: string | null
  resetPasswordExpires: Date | null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email: body.email }
    })

    if (!usuario) {
      return NextResponse.json(
        { message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña' },
        { status: 200 }
      )
    }

    // Generar token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Guardar token en la base de datos
    await prisma.$executeRaw`
      UPDATE Usuario 
      SET resetPasswordToken = ${resetToken},
          resetPasswordExpires = ${resetTokenExpiry}
      WHERE email = ${body.email}
    `

    // Enviar email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: body.email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetUrl}">Restablecer contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste esto, puedes ignorar este email.</p>
      `
    })

    return NextResponse.json({
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña'
    })

  } catch (error) {
    console.error('Error en recuperación de contraseña:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
} 