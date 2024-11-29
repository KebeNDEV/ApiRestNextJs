-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `emailVerificado` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tokenExpiracion` DATETIME(3) NULL,
    ADD COLUMN `tokenVerificacion` VARCHAR(191) NULL;
