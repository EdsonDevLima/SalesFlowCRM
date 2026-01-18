import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../database/entities/sale';
import { Product } from '../database/entities/product';
import { User } from '../database/entities/user';
import { ISaleDto } from '../database/dtos/sale-dtos';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale) private readonly saleRepository: Repository<Sale>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

async createSale(dto: ISaleDto) {
        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) throw new Error('Usuário não existe');

        const products: Product[] = [];
        
        for (const productId of dto.productIds) {
            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) throw new Error(`Produto com ID ${productId} não encontrado`);
            products.push(product);
        }

        const sale = new Sale();
        sale.user = user;
        sale.products = products;
        sale.total = dto.total;

        await this.saleRepository.save(sale);
        return sale;
    }

    async getAllSales() {
        return await this.saleRepository.find({ relations: ['user', 'products'] });
    }

    async getSaleById(id: number) {
        return await this.saleRepository.findOne({ where: { id }, relations: ['user', 'products'] });
    }
}
