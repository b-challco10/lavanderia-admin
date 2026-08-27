-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PAGADO', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "EstadoServicio" AS ENUM ('RECIBIDO', 'EN_PROCESO', 'LISTO_PARA_ENTREGAR', 'ENTREGADO');

-- CreateEnum
CREATE TYPE "CategoriaGasto" AS ENUM ('INSUMOS', 'SERVICIOS_BASICOS', 'MANTENIMIENTO', 'VARIOS');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "telefonoCliente" TEXT,
    "detallePrendas" TEXT NOT NULL,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "montoAdelanto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "estadoServicio" "EstadoServicio" NOT NULL DEFAULT 'RECIBIDO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gasto" (
    "id" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "categoria" "CategoriaGasto" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Pedido_nombreCliente_idx" ON "Pedido"("nombreCliente");

-- CreateIndex
CREATE INDEX "Pedido_telefonoCliente_idx" ON "Pedido"("telefonoCliente");

-- CreateIndex
CREATE INDEX "Pedido_estadoServicio_idx" ON "Pedido"("estadoServicio");

-- CreateIndex
CREATE INDEX "Pedido_estadoPago_idx" ON "Pedido"("estadoPago");

-- CreateIndex
CREATE INDEX "Pedido_createdAt_idx" ON "Pedido"("createdAt");

-- CreateIndex
CREATE INDEX "Gasto_fecha_idx" ON "Gasto"("fecha");

-- CreateIndex
CREATE INDEX "Gasto_categoria_idx" ON "Gasto"("categoria");
