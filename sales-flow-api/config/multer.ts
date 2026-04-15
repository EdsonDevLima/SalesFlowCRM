import { BadRequestException } from '@nestjs/common'
import { diskStorage } from 'multer'
import type { Request } from 'express'
import type { FileFilterCallback } from 'multer'
import { extname } from 'path'

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/products',
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1e9)

      callback(null, `${uniqueName}${extname(file.originalname)}`)
    },
  }),

  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException(
        'Apenas imagens JPG, PNG ou WEBP são permitidas',
      )
    }

    callback(null, true)
  },
}
