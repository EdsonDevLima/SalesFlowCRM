import React, { useState } from "react";
import Style from "./formProduct.module.css"
import { IoClose } from "react-icons/io5";
import { apiMultiPart } from "../../../service/api";
import { toast } from "react-toastify";

export function FormProduct() {
  const [price, setPrice] = useState<string>("R$ 0,00");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status,setStatus] = useState<string>("")
  const [category,setCategory] = useState<string>("")
  const [amount,setAmount] = useState<number>(0)
  const [isOnPromotion,setIsOnPromotion] = useState<boolean>(false)

  
  const [image,setImage] = useState<File | null>(null)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const priceValue = getPriceValue();

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", String(priceValue));
  formData.append("description", description);
  formData.append("category",category)
  formData.append("amount",String(amount))
  formData.append("status",status)
  formData.append("isPromotion",String(isOnPromotion))

  if (image) {
    formData.append("image", image); 
  }

  try {
    await apiMultiPart.post("/products/create", formData);
    setDisplayForm(false)
    toast.success("Produto criados com sucesso")
  } catch (error) {
    console.error(error);
  }
};

  return (

    <div className={Style.conteinerForm}>
    <button className="submitButton success" onClick={()=>handleForm()}>Cadastrar</button>
    {displayForm && <div onClick={()=>handleForm()} className={Style.modalFormProduct}>
      <span className={Style.closeFormProduct} onClick={()=>handleForm()}>
        <IoClose />
      </span>
      <form onClick={(e) => e.stopPropagation()}  onSubmit={handleSubmit}>
        <div className={Style.conteinerFormProducts}>
        <h2>Cadastrar produto</h2>
        
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
            <select value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option>Usado</option>
              <option>Novo</option>
            </select>
        </label>

        <label className={Style.labelSelect}>
          Categoria:
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
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
          onChange={(e)=>setAmount(parseInt(e.target.value))}
            type="number" 
            placeholder="00"
            required
          />
        </label>

        <label className={Style.labelCheckbox}>
          <span>Promoção:</span>
          <input onChange={()=>setIsOnPromotion(!isOnPromotion)} type="checkbox" />
        </label>

        <label>
          <label htmlFor="imageUpload" className={Style.customFileButton}>
    Upload de imagem
  </label>

  <input
    id="imageUpload"
    type="file"
    accept="image/*"
    className={Style.fileInput}
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    }}
    required
  />
        </label>
        
        <input type="submit" value="Cadastrar" className={Style.buttonRegister} />
        </div>
      </form>
    </div>}</div>
  );
}