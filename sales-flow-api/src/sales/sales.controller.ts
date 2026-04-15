import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { SalesService } from './sales.service';
import type { ISaleDto } from '../database/dtos/sale-dtos';

@Controller('sales')
export class SalesController {
    constructor(private readonly service: SalesService) {}

    @Post('create')
    async create(@Body() body: ISaleDto) {
        try {

            const sale = await this.service.createSale(body);
            return sale;
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Put("update")
    async update(@Body() body: ISaleDto){
        try {

        const result = await this.service.updateSale(body)

            return result;
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }   
    }
    @Get('all')
    async getAll() {
        try {
            return await this.service.getAllSales();
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        try {
            const sale = await this.service.getSaleById(id);
            if (!sale) throw new HttpException('Venda não encontrada', HttpStatus.NOT_FOUND);
            return sale;
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
