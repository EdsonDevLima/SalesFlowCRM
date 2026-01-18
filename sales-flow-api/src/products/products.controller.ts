import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { IProductDto } from 'src/database/dtos/products-dtos';
import { Product } from 'src/database/entities/product';

@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) { }

    @Post("create")
    async create(@Body() body: IProductDto) {

        try {
            console.log("corpo da requisição",body)
            const newProduct = new Product()
            newProduct.name = body.name
            newProduct.price = body.price
            newProduct.description = body.description
            await this.service.createProduct(newProduct)
            return { message: "Produto criado com sucesso" }

        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
    @Delete("delete")
    async remove(@Body() boby: IProductDto) {
        try {
            if (boby.id) {
                const productExist = await this.service.getProduct(boby.id)
                if (productExist) {
                    await this.service.removeProduct(boby.id)
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
}
