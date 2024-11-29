import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// GET - Obtener todos los usuarios
export async function GET() {
    try {
        const usuarios = await prisma.usuario.findMany();
        return NextResponse.json(usuarios);
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
        
        // Validación básica
        if (!body.nombre || !body.email) {
            return NextResponse.json(
                { error: "Nombre y email son requeridos" },
                { status: 400 }
            );
        }

        const usuario = await prisma.usuario.create({
            data: {
                nombre: body.nombre,
                email: body.email
            }
        });

        return NextResponse.json(usuario, { status: 201 });
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
        const body = await request.json();
        
        const usuario = await prisma.usuario.update({
            where: { id: body.id },
            data: {
                nombre: body.nombre,
                email: body.email
            }
        });

        return NextResponse.json(usuario);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al actualizar el usuario" },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar usuario
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        
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
