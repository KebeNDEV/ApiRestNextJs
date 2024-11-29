import { NextResponse } from 'next/server';
import type { Usuario } from '@/app/types/usuario';

// Simulamos una base de datos con un array
let usuarios: Usuario[] = [
    { id: 1, nombre: "Juan", email: "juan@ejemplo.com" },
    { id: 2, nombre: "María", email: "maria@ejemplo.com" }
];

// GET - Obtener todos los usuarios
export async function GET() {
    return NextResponse.json(usuarios);
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

        // Crear nuevo usuario
        const nuevoUsuario: Usuario = {
            id: usuarios.length + 1,
            nombre: body.nombre,
            email: body.email
        };

        usuarios.push(nuevoUsuario);
        return NextResponse.json(nuevoUsuario, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: "Error al procesar la solicitud" },
            { status: 400 }
        );
    }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Encontrar el usuario
    const index = usuarios.findIndex(u => u.id === body.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar usuario
    usuarios[index] = {
      ...usuarios[index],
      nombre: body.nombre,
      email: body.email
    };

    return NextResponse.json(usuarios[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el usuario' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    
    // Encontrar el usuario
    const index = usuarios.findIndex(u => u.id === body.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar usuario
    usuarios = usuarios.filter(u => u.id !== body.id);

    return NextResponse.json(
      { message: 'Usuario eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar el usuario' },
      { status: 500 }
    );
  }
}
