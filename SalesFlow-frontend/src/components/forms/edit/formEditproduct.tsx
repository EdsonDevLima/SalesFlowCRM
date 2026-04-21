import React, { useState, useEffect } from "react";
import Style from "./formEditProduct.module.css"
import { IoClose } from "react-icons/io5";
import api from "../../../service/api"; 
import { ButtonLoading } from "../../load/ButtonLoading";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  category: string;
  amount: number;
  isOnPromotion: boolean;
  image?: string;
}

interface FormEditProductProps {
  product: Product;
  onClose: () => void;
  onUpdate?: () => void;
}

export function FormEditProduct({ product, onClose, onUpdate }: FormEditProductProps) {
  const [price, setPrice] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isOnPromotion, setIsOnPromotion] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  setName(product.name);
  setDescription(product.description);
  setStatus(product.status || "Novo");
  setCategory(product.category || "Eletronicos");
  setAmount(product.amount);
  setIsOnPromotion(product.isOnPromotion);


  const priceNumber = Number(product.price) || 0;

  const valorFormatado = priceNumber
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  setPrice("R$ " + valorFormatado);
}, [product]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value;
    
    valor = valor.replace(/\D/g, '');
    
    const numero = parseInt(valor) / 100;
    
    let valorFormatado = numero.toFixed(2);
    valorFormatado = valorFormatado.replace('.', ',');
    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    setPrice('R$ ' + valorFormatado);
  };

  const getPriceValue = (): number => {
    return parseFloat(
      price
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const priceValue = getPriceValue();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", String(priceValue));
    formData.append("description", description);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("amount", String(amount));
    formData.append("isOnPromotion", String(isOnPromotion));


    try {
      await api.put(`/products/update`, formData);
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.modalFormProduct} onClick={onClose}>
      <span className={Style.closeFormProduct} onClick={onClose}>
        <IoClose />
      </span>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={Style.conteinerFormProducts}>
          <h2>Editar produto</h2>
          
          <label>
            Nome:
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          
          <label>
            Descrição:
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label className={Style.labelSelect}>
            Estado do produto:
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Usado</option>
              <option>Novo</option>
            </select>
          </label>

          <label className={Style.labelSelect}>
            Categoria:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Eletronicos</option>
              <option>Livros</option>
              <option>Utensílios de casa</option>
              <option>Brinquedos e hobies</option>
              <option>Produtos estiticos</option>
            </select>
          </label>
          
          <label className={Style.priceProduct}>
            Preço:
            <input 
              type="text" 
              placeholder="R$ 0,00"
              value={price}
              onChange={handlePriceChange}
              required
            />
          </label>

          <label className={Style.priceProduct}>
            Quantidade:
            <input 
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              type="number" 
              placeholder="00"
              required
            />
          </label>

          <label className={Style.labelCheckbox}>
            <span>Promoção:</span>
            <input 
              checked={isOnPromotion}
              onChange={() => setIsOnPromotion(!isOnPromotion)} 
              type="checkbox" 
            />
          </label>         
        <ButtonLoading loading={loading} text="Salvar alterações" className={Style.buttonRegister} />
        </div>
      </form>
    </div>
  );
}
