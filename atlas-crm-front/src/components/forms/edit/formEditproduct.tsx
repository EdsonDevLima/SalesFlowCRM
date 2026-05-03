import React, { useState, useEffect } from "react";
import Style from "./formEditProduct.module.css"
import { IoClose } from "react-icons/io5";
import { apiMultiPart } from "../../../service/api"; 
import { AuthImage } from "../../common/AuthImage";
import { ButtonLoading } from "../../load/ButtonLoading";
import { toast } from "react-toastify";
import notFound from "/public/not_found.jpg";

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
  const acceptedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/svg+xml",
    "image/tiff",
    "image/x-icon",
    "image/avif",
    "image/heic",
    "image/heif"
  ];

  const [price, setPrice] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isOnPromotion, setIsOnPromotion] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  setName(product.name);
  setDescription(product.description);
  setStatus(product.status || "Novo");
  setCategory(product.category || "Eletronicos");
  setAmount(product.amount);
  setIsOnPromotion(product.isOnPromotion);
  setImage(null);


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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setImage(null);
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    const isWebp =
      selectedFile.type === "image/webp" || fileExtension === "webp";

    if (isWebp) {
      toast.error("Imagens em formato WEBP nao sao permitidas.");
      e.target.value = "";
      setImage(null);
      return;
    }

    if (!acceptedImageTypes.includes(selectedFile.type)) {
      toast.error("Selecione uma imagem valida.");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const priceValue = getPriceValue();

    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("name", name);
    formData.append("price", String(priceValue));
    formData.append("description", description);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("amount", String(amount));
    formData.append("isOnPromotion", String(isOnPromotion));
    if (image) {
      formData.append("image", image);
    }


    try {
      await apiMultiPart.put(`/products/update`, formData);
      toast.success("Produto atualizado com sucesso!");
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Nao foi possivel atualizar o produto.");
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

          <div className={Style.currentImageContainer}>
            {product.image && !image && (
              <>
                <p>Imagem atual:</p>
                <AuthImage
                  src={`products/image/${product.image}`}
                  alt={product.name}
                  fallback={notFound}
                  className={Style.previewImage}
                />
              </>
            )}

            {image && (
              <>
                <p>Nova imagem:</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Nova imagem do produto"
                  className={Style.previewImage}
                />
              </>
            )}
          </div>

          <div>
            <label htmlFor="editImageUpload" className={Style.customFileButton}>
              {image ? "Trocar imagem selecionada" : "Enviar nova imagem"}
            </label>

            <input
              id="editImageUpload"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.tif,.tiff,.ico,.avif,.heic,.heif"
              className={Style.fileInput}
              onChange={handleImageChange}
            />
          </div>

        <ButtonLoading loading={loading} text="Salvar alterações" className={Style.buttonRegister} />
        </div>
      </form>
    </div>
  );
}
