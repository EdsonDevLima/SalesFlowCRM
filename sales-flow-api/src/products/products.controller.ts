import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { IProductDto } from 'src/database/dtos/products-dtos';
import { Product } from 'src/database/entities/product';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'config/multer';
import { existsSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express'

@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) { }

    @Post("create")
    @UseInterceptors(FileInterceptor('image', multerConfig))
    async create(@Body() body: IProductDto,@UploadedFile() file?: Express.Multer.File,) {
        try {
            const newProduct = new Product()
            newProduct.name = body.name
            newProduct.price = body.price
            newProduct.description = body.description
            newProduct.amount = body.amount
            newProduct.category = body.category
            newProduct.isPromotion = body.isPromotion
            newProduct.status = body.status
            console.log("arquivo",JSON.stringify(file) )
            if (file) {
                    newProduct.image = file.filename
                    }
            await this.service.createProduct(newProduct)
            return { message: "Produto criado com sucesso" }

        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
    @Delete(":id")
    @UseInterceptors(FileInterceptor(''))
    async remove(@Param() Param:{id:number}) {
        try {
            if (Param.id) {
                const productExist = await this.service.getProduct(Param.id)
                if (productExist) {
                    await this.service.removeProduct(Param.id)
                    return { message: "Produto removido" }
                } else {
                    throw new HttpException("Produto não encontrado", HttpStatus.NOT_FOUND)
                }
            }
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
    @Get("all")
    async getAll() {
        try {
            const products = await this.service.getAllProducts()
            return products
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Get(":id")
    async getProduct(@Param("id") id: number) {
        try {

            const product = await this.service.getProduct(id)
            if (product) {
                return product
            } else {
                throw new HttpException("Produto não encontrado", HttpStatus.NOT_FOUND)
            }

        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Put('update')
    async updateProduc(@Body() Body:IProductDto){

        try{

            const response = await this.service.updateProduct(Body)
            return response

        }catch(error){

            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)

        }


    }

   @Get('image/:filename')
   getImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const imagePath = join(
        process.cwd(),
        'uploads',
        'products',
        filename,
      )

      if (!existsSync(imagePath)) {
        throw new HttpException(
          'Imagem não encontrada',
          HttpStatus.NOT_FOUND,
        )
      }

      return res.sendFile(imagePath)
    } catch (error) {
          if (error instanceof Error) {
    console.error(error.message)
  }
      throw new HttpException(
        'Erro ao carregar imagem',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
