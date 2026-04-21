import { useEffect, useState, useCallback } from "react";
import type { IProducts } from "../../types/products";
import api from "../../service/api";
import { FaEye } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import notFound from "/public/not_found.jpg"
import { FormProduct } from "../forms/register/formProduct"; 
import Styles from "./productList.module.css";
import { SearchProduct } from "../search/searchProducts";
import { FormEditProduct } from "../forms/edit/formEditproduct";
import { toast } from "react-toastify";
import axios from "axios";

export function ProductsList() {
  const [allProducts, setAllProducts] = useState<IProducts[]>([]);
  const [productForEdit, setProductForEdit] = useState<IProducts | null>(null);
  const [removeList, setRemoveList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [search,setSearch] = useState<string>("")
  const changeRemoveList = (id: number) => {
    setRemoveList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("products/all");
      const data = (response.data.items as IProducts[]) || [];
      setAllProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteSelected = async () => {
    if (removeList.length === 0) {
      return;
    }

    if (!confirm(`Deseja remover ${removeList.length} produto(s)?`)) {
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        removeList.map((id) => api.delete(`products/${id}`))
      );

      setAllProducts((prev) =>
        prev.filter((product) => !removeList.includes(product.id || 0))
      );

      setRemoveList([]);
      toast.success("Produto(s) removido(s) com sucesso!");
    }catch (error: unknown) {
      let message = "Erro ao remover produto";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }

      toast.error(message);
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

      const filteredCustomers = allProducts.filter((product) =>
  product.name?.toLowerCase().includes(search.toLowerCase()) ||
  product.id?.toString().includes(search)
)

  return (
    <div>
      <div className="header-actions">
        <FormProduct onProductCreated={getProducts} />
        <SearchProduct onChange={setSearch} value={search}/>
        <button
          className="submitButton error"
          onClick={handleDeleteSelected}
          disabled={removeList.length === 0 || loading}
        >
          <CiTrash />
          {removeList.length > 0 && ` (${removeList.length})`}
        </button>
      </div>

      {loading && <p>Carregando...</p>}

      {filteredCustomers.length > 0 ? <div className={Styles.listProducts}>
        {filteredCustomers.map((i) => (
          <div key={i.id} className={Styles.cardProduct}>
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={removeList.includes(i.id || 0)}
                onChange={() => changeRemoveList(i.id || 0)}
              />
              <span className="custom-checkbox"></span>
            </label>

            <img
              src={
                i.image
                  ? `${import.meta.env.VITE_API_URL}/products/image/${i.image}`
                  : notFound
              }
              alt={i.name}
            />

            <div className={Styles.aditionalInfor}>
              <p>{i.name}</p>
              <p>R$ {i.price},00</p>

              <button
                className="submitButton edit"
                onClick={() => setProductForEdit(i)}
              >
                <FaEye />
              </button>
            </div>
          </div>
        ))}
      </div> : <p className={Styles.nother}>Nenhum produto encontrado</p> }

      {productForEdit && (
       <FormEditProduct
          product={{
            ...productForEdit,
            id: String(productForEdit.id ?? "")
          }}
          onClose={() => setProductForEdit(null)}
          onUpdate={getProducts}
        />
      )}
    </div>
  );
}
