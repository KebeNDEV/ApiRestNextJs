const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Crear usuarios
  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: "Juan Pérez",
      email: "juan@ejemplo.com",
      password: "123456",
      rol: "admin",
      perfil: {
        create: {
          biografia: "Escritor y desarrollador web",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          telefono: "123456789"
        }
      }
    }
  })

  const usuario2 = await prisma.usuario.create({
    data: {
      nombre: "María García",
      email: "maria@ejemplo.com",
      password: "123456",
      rol: "usuario",
      perfil: {
        create: {
          biografia: "Diseñadora gráfica",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          telefono: "987654321"
        }
      }
    }
  })

  // Crear categorías
  const categoria1 = await prisma.categoria.create({
    data: {
      nombre: "Tecnología",
      descripcion: "Posts sobre desarrollo y tecnología"
    }
  })

  const categoria2 = await prisma.categoria.create({
    data: {
      nombre: "Diseño",
      descripcion: "Posts sobre diseño web y gráfico"
    }
  })

  // Crear posts con categorías
  const post1 = await prisma.post.create({
    data: {
      titulo: "Introducción a Next.js",
      contenido: "Next.js es un framework de React que permite crear aplicaciones web modernas...",
      publicado: true,
      autorId: usuario1.id,
      categorias: {
        connect: { id: categoria1.id }
      }
    }
  })

  const post2 = await prisma.post.create({
    data: {
      titulo: "Principios de diseño UI/UX",
      contenido: "El diseño de interfaces de usuario es fundamental para crear experiencias...",
      publicado: true,
      autorId: usuario2.id,
      categorias: {
        connect: { id: categoria2.id }
      }
    }
  })

  // Crear comentarios
  await prisma.comentario.createMany({
    data: [
      {
        contenido: "¡Excelente artículo! Muy útil para principiantes.",
        postId: post1.id,
        autorId: usuario2.id
      },
      {
        contenido: "Gracias por compartir esta información.",
        postId: post2.id,
        autorId: usuario1.id
      }
    ]
  })

  console.log('Datos de prueba creados correctamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })