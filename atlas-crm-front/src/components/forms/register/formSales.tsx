import React, {  useEffect, useState } from "react";
import Style from "./formSales.module.css";
import { IoClose } from "react-icons/io5";
import api from "../../../service/api"; 
import { apiMultiPart } from "../../../service/api";
import type { ICustomer } from "../../../types/customers";
import type { IProducts } from "../../../types/products"; 
import { ButtonLoading } from "../../load/ButtonLoading";
import { toast } from "react-toastify";
import axios from "axios";


interface FormSalesProps {
  onSaleAdded: () => Promise<void> | void;
}

export function FormSales({ onSaleAdded }: FormSalesProps) {
  type SaleProductItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
  };

  const [allCustomers, setAllCustomers] = useState<ICustomer[]>([]);
  const [allProducts, setAllProducts] = useState<IProducts[]>([]);
  const [displayForm, setDisplayForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQty, setProductQty] = useState(1);

  const formatAddress = (id?:string)=>{
    if(id !== ""){
   const user =  allCustomers.filter((c)=>c.id == parseInt(id || "0"))[0]
   const addressParserd = `Cidade :${user.adress.city || ""}\nRua: ${user.adress.street} \nCep: ${user.adress.zip || ""}\nNumero:${user.adress.number}`
   return addressParserd
    }
      
  }
  const [listProducts, setListProducts] = useState<SaleProductItem[]>([]);

  const [total, setTotal] = useState(0);


  const getProducts = async () => {
    const response = await api.get("products/all");
    const data = (response.data.items as IProducts[]) || [];
    if (data.length > 0) setAllProducts(data);
  };


  const getCustomers = async () => {
    const response = await api.get("user/customers");
    const data = (response.data.items as ICustomer[]) || [];
    if (data.length > 0) setAllCustomers(data);
  };

  useEffect(() => {
    getProducts();
    getCustomers();
  }, []);


  useEffect(() => {
    const nextTotal = listProducts.reduce((sum, item) => sum + item.total, 0);
    setTotal(nextTotal);
  }, [listProducts]);

  const handleForm = () => setDisplayForm(!displayForm);

  const addProductToList = () => {
    if (!selectedProduct || productQty <= 0) return;
    const product = allProducts.find((p) => String(p.id) === selectedProduct);
    if (!product) return;

    const quantityAlreadyAdded = listProducts
      .filter((item) => item.id === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    const nextQuantity = quantityAlreadyAdded + productQty;

    if (nextQuantity > product.amount) {
      toast.error(`Estoque insuficiente para ${product.name}. Disponivel: ${product.amount}.`);
      return;
    }

    setListProducts((prev) => [
      ...prev,
      {
        name: product.name,
        price: Number(product.price),
        id: product.id || 0,
        quantity: productQty,
        total: Number(product.price) * productQty,
      },
    ]);
    setSelectedProduct("");
    setProductQty(1);
  };

  const removeProduct = (index: number) => {
    setListProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCustomer || listProducts.length === 0) {
      return;
    }

    setLoading(true);
    
    try {
      const ids = listProducts.map(({id})=>id)
      const productAmountById = listProducts.reduce<Record<number, number>>((acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + item.quantity;
        return acc;
      }, {});

      const productsToUpdate = Object.entries(productAmountById).map(([id, quantity]) => {
        const product = allProducts.find((item) => item.id === Number(id));

        if (!product) {
          throw new Error("Produto do pedido nao encontrado para atualizacao de estoque.");
        }

        const updatedAmount = product.amount - quantity;

        if (updatedAmount < 0) {
          throw new Error(`Estoque insuficiente para ${product.name}.`);
        }

        return { product, updatedAmount };
      });

      const body = {
        userId: selectedCustomer,
        productIds: ids, 
        total: total,         
      };

      await api.post("/sales/create", body);

      await Promise.all(
        productsToUpdate.map(async ({ product, updatedAmount }) => {
          const formData = new FormData();
          formData.append("id", String(product.id));
          formData.append("name", product.name);
          formData.append("price", String(product.price));
          formData.append("description", product.description);
          formData.append("category", product.category);
          formData.append("status", product.status);
          formData.append("amount", String(updatedAmount));
          formData.append("isOnPromotion", String(product.isOnPromotion));

          await apiMultiPart.put("/products/update", formData);
        })
      );

      setListProducts([]);
      setSelectedCustomer("");
      setSelectedProduct("");
      setProductQty(1);
      setTotal(0);
      setDisplayForm(false);
      toast.success("Pedido criado com sucesso.");

      await getProducts();
      await onSaleAdded();
    } catch (error: unknown) {
      console.error("Erro ao cadastrar venda:", error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro inesperado ao cadastrar pedido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.conteinerForm}>
      <button type="button" className="submitButton success" onClick={handleForm}>
        Cadastrar
      </button>

      {displayForm && (
        <div onClick={handleForm} className={Style.modalFormSales}>
          <span className={Style.closeFormSales} onClick={handleForm}>
            <IoClose />
          </span>

          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <h2>Cadastrar venda</h2>

            <label>
              Clientes:
              <select
                value={selectedCustomer}
                onChange={(e) => {setSelectedCustomer(e.target.value)}}
                required
              >
                <option disabled value="">
                  Selecione o cliente
                </option>
                {allCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Produtos:
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option disabled value="">
                  Selecione o produto
                </option>
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.amount <= 0}>
                    {p.name} - estoque: {p.amount}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantidade:
              <input
                type="number"
                value={productQty}
                onChange={(e) => setProductQty(Number(e.target.value))}
                min="1"
              />
            </label>

            <button type="button" className={Style.submitButton} onClick={addProductToList}>
              Adicionar produto
            </button>

            {listProducts.length === 0 && (
              <p>Adicione pelo menos um produto para cadastrar o pedido.</p>
            )}

            <label>
              Lista de produtos:
              <div className={Style.listContainer}>
                {listProducts.length === 0 && <p>Nenhum produto adicionado.</p>}

                {listProducts.map((item, index) => (
                  <div key={index} className={Style.listItem}>
                    <span>
                      {item.name} x{item.quantity} - R$ {item.total.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      className={Style.removeButton}
                      onClick={() => removeProduct(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </label>

            <label>
              Endereço:
              <textarea value={formatAddress(selectedCustomer)} readOnly />
            </label>

            <label>
              Total:
              <input
                type="text"
                disabled
                value={total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              />
            </label>

            <ButtonLoading
              loading={loading}
              text="Cadastrar"
              className={Style.buttonRegister}
              disabled={!selectedCustomer || listProducts.length === 0}
            />
          </form>
        </div>
      )}
    </div>
  );
}
