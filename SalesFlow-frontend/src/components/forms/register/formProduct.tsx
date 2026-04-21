import React, { useState } from "react";
import Style from "./formProduct.module.css"
import { IoClose } from "react-icons/io5";
import { apiMultiPart } from "../../../service/api";
import { toast } from "react-toastify";
import { ButtonLoading } from "../../load/ButtonLoading";

interface FormProductProps {
  onProductCreated?: () => Promise<void> | void;
}

export function FormProduct({ onProductCreated }: FormProductProps) {
  const [price, setPrice] = useState<string>("R$ 0,00");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status,setStatus] = useState<string>("Usado")
  const [category,setCategory] = useState<string>("Eletronicos")
  const [amount,setAmount] = useState<number>(0)
  const [isOnPromotion,setIsOnPromotion] = useState<boolean>(false)

  
  const [image,setImage] = useState<File | null>(null)
  const [displayForm,setDisplayForm] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
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

  const resetForm = () => {
    setPrice("R$ 0,00");
    setName("");
    setDescription("");
    setStatus("Usado");
    setCategory("Eletronicos");
    setAmount(0);
    setIsOnPromotion(false);
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
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

    await apiMultiPart.post("/products/create", formData);
    resetForm();
    setDisplayForm(false)
    toast.success("Produto criados com sucesso")
    await onProductCreated?.()
  } catch (error) {
    console.error(error);
    toast.error("Nao foi possivel cadastrar o produto.");
  } finally {
    setLoading(false);
  }
};

  return (

    <div className={Style.conteinerForm}>
    <button type="button" className="submitButton success" onClick={()=>handleForm()}>Cadastrar</button>
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
          onChange={(e)=>setAmount(Number(e.target.value) || 0)}
            type="number" 
            placeholder="00"
            min="0"
            required
          />
        </label>

        <label className={Style.labelCheckbox}>
          <span>Promoção:</span>
          <input onChange={()=>setIsOnPromotion(!isOnPromotion)} type="checkbox" />
        </label>

        <div>
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
        </div>
        
        <ButtonLoading loading={loading} text="Cadastrar" className={Style.buttonRegister} />
        </div>
      </form>
    </div>}</div>
  );
}
