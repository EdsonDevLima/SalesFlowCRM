import React, { use, useEffect, useState } from "react";
import Style from "./formSales.module.css";
import { IoClose } from "react-icons/io5";
import api from "../../../service/api"; 
import type { ICustomer } from "../../../types/customers";
import type { IProducts } from "../../../types/products"; 


interface FormSalesProps {
  onSaleAdded: () => Promise<void>;
}

export function FormSales({ onSaleAdded }: FormSalesProps) {
  const [allCustomers, setAllCustomers] = useState<ICustomer[]>([]);
  const [allProducts, setAllProducts] = useState<IProducts[]>([]);
  const [displayForm, setDisplayForm] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQty, setProductQty] = useState(1);

  const formatAddress = (id?:string)=>{
    if(id !== ""){
   const user =  allCustomers.filter((c)=>c.id == parseInt(id))[0]
   const addressParserd = `Cidade :${user.adress.city || ""}\nRua: ${user.adress.street} \nCep: ${user.adress.zip || ""}\nNumero:${user.adress.number}`
   return addressParserd
    }
      
  }
  const [listProducts, setListProducts] = useState<
    { name: string; price: number; id:number; }[]
  >([]);

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
    if (!selectedProduct || productQty <= 0) {
      setTotal(0);
      return;
    }

    const product = allProducts.find((p) => p.name === selectedProduct);

    if (product) {
      setTotal(product.price * productQty);
    }
  }, [selectedProduct, productQty, allProducts]);

  const handleForm = () => setDisplayForm(!displayForm);

  const addProductToList = () => {

    const product = allProducts.find((p) => p.name === selectedProduct);
    if (!product) return;

    setListProducts((prev) => [...prev, { name: product.name, price: product.price, id:product.id || 0 }]);
    setProductQty(1);
  };

  const removeProduct = (index: number) => {
    setListProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const ids = listProducts.map(({id})=>id)
      const body = {
        userId: selectedCustomer,
        productIds: ids, 
        total: total,         
      };

      await api.post("/sales/create", body);

      setListProducts([]);
      setSelectedCustomer("");
      setSelectedProduct("");
      setProductQty(1);
      setTotal(0);
      setDisplayForm(false);

      await onSaleAdded();
    } catch (error) {
      console.error("Erro ao cadastrar venda:", error);
    }
  };

  return (
    <div className={Style.conteinerForm}>
      <button className="submitButton success" onClick={handleForm}>
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
                  <option key={p.id} value={p.name}>
                    {p.name}
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
              />
            </label>

            <button type="button" className={Style.submitButton} onClick={addProductToList}>
              Adicionar produto
            </button>

            <label>
              Lista de produtos:
              <div className={Style.listContainer}>
                {listProducts.length === 0 && <p>Nenhum produto adicionado.</p>}

                {listProducts.map((item, index) => (
                  <div key={index} className={Style.listItem}>
                    <span>
                      {item.name} — R$ {item.price && `${item.price},00`}
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
              <textarea value={formatAddress(selectedCustomer)} />
            </label>

            <label>
              Total:
              <input type="text" disabled value={`R$ ${total.toFixed(2)}`} />
            </label>

            <input type="submit" value="Cadastrar" className={Style.buttonRegister} />
          </form>
        </div>
      )}
    </div>
  );
}