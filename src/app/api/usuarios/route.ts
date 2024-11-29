import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { hashPassword } from '@/lib/auth';
import { Prisma, type Usuario } from '@prisma/client';
import { validatePassword } from '@/lib/validations';

// GET - Obtener todos los usuarios
export async function GET() {
    try {
        const usuarios = await prisma.$queryRaw<Usuario[]>`
            SELECT id, nombre, email FROM Usuario
        `;
        
        const usuariosResponse = usuarios.map(usuario => ({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        }));
        
        return NextResponse.json(usuariosResponse);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener usuarios" },
            { status: 500 }
        );
    }
}

// POST - Crear un nuevo usuario
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.nombre || !body.email || !body.password) {
            return NextResponse.json(
                { error: "Nombre, email y password son requeridos" },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(body.password);

        const usuario = await prisma.$queryRaw<Usuario[]>`
            INSERT INTO Usuario (nombre, email, password, rol, updatedAt)
            VALUES (${body.nombre}, ${body.email}, ${hashedPassword}, 'usuario', NOW())
            RETURNING id, nombre, email
        `;

        const usuarioResponse = {
            id: usuario[0].id,
            nombre: usuario[0].nombre,
            email: usuario[0].email
        };

        return NextResponse.json(usuarioResponse, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al crear el usuario" },
            { status: 500 }
        );
    }
}

// PUT - Actualizar usuario
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        
        if (!body.id) {
            return NextResponse.json(
                { error: "ID de usuario es requerido" },
                { status: 400 }
            )
        }

        const updateData: any = {
            updatedAt: new Date()
        }

        if (body.nombre) {
            updateData.nombre = body.nombre
        }
        if (body.email) {
            updateData.email = body.email
        }
        if (body.password) {
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
            updateData.password = await hashPassword(body.password)
        }

        const usuario = await prisma.usuario.update({
            where: { id: body.id },
            data: updateData,
            select: {
                id: true,
                nombre: true,
                email: true
            }
        })

        return NextResponse.json({
            message: "Usuario actualizado correctamente",
            usuario
        })
    } catch (error) {
        console.error('Error en actualización:', error)
        return NextResponse.json(
            { error: "Error al actualizar el usuario" },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar usuario
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.id) {
            return NextResponse.json(
                { error: "ID de usuario es requerido" },
                { status: 400 }
            );
        }

        await prisma.usuario.delete({
            where: { id: body.id }
        });

        return NextResponse.json(
            { message: "Usuario eliminado correctamente" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al eliminar el usuario" },
            { status: 500 }
        );
    }
}
