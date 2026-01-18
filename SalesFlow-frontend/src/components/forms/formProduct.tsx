import React, { useState } from "react";
import Style from "./formProduct.module.css"
import { IoClose } from "react-icons/io5";
import api from "../../service/api";

export function FormProduct() {
  const [price, setPrice] = useState<string>("R$ 0,00");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [displayForm,setDisplayForm] = useState<boolean>(false)

  const handleForm = ()=>{
    if(displayForm){
        setDisplayForm(false)
    }else{
        setDisplayForm(true)
    }

  }
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const priceValue = getPriceValue();
    
    const body = {
    name,
    price: priceValue,
    description
    }
     api.post("/products/create",body)

    

    alert(`Produto cadastrado!\nNome: ${name}\nPreço: ${price}\nValor numérico: ${priceValue}`);
  };

  return (

    <div className={Style.conteinerForm}>
    <button className="submitButton success" onClick={()=>handleForm()}>Cadastrar</button>
    {displayForm && <div onClick={()=>handleForm()} className={Style.modalFormProduct}>
      <span className={Style.closeFormProduct} onClick={()=>handleForm()}>
        <IoClose />
      </span>
      <form onClick={(e) => e.stopPropagation()}  onSubmit={handleSubmit}>
        <h2>Cadastrar produto.</h2>
        
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
        
        <label>
          Imagem:
          <input 
            type="file"
            accept="image/*"
          />
        </label>
        
        <input type="submit" value="Cadastrar" className={Style.buttonRegister} />
      </form>
    </div>}</div>
  );
}