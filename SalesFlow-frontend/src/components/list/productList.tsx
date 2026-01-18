import { useEffect, useState, useCallback } from "react";
import type { IProducts } from "../../types/products";
import api from "../../service/api";
import { FaEye } from "react-icons/fa";
import notFound from "../../../public/not_found.jpg";
import { FormProduct } from "../forms/formProduct";
import { CiTrash } from "react-icons/ci";
import { FormProductEdit } from "../forms/formProductEdit";
import Styles from "./productList.module.css";

export function ProductsList() {
  const [allProducts, setAllProducts] = useState<IProducts[]>([]);
  const [productForEdit, setProductForEdit] = useState<IProducts | null>(null);
  const [removeList, setRemoveList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

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
      alert("Selecione pelo menos um produto");
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
      alert("Produtos removidos com sucesso!");
    } catch (error) {
      console.error("Erro ao remover produtos", error);
      alert("Erro ao remover produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div>
      <div className="header-actions">
        <FormProduct/>

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

      <div className={Styles.listProducts}>
        {productForEdit && (
          <FormProductEdit
            name={productForEdit.name}
            description={productForEdit.description}
            price={productForEdit.price}
            photo={productForEdit.photo}
          />
        )}

        {allProducts.map((i) => (
          <div key={i.id} className={Styles.cardProduct}>
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={removeList.includes(i.id || 0)}
                onChange={() => changeRemoveList(i.id || 0)}
              />
              <span className="custom-checkbox"></span>
            </label>

            <img src={i.photo || notFound} alt={i.name} />

            <div className={Styles.aditionalInfor}>
              <p>{i.name || "Nome não informado"}</p>
              <p>R$ {i.price},00</p>

              <div>
                <button
                  className="submitButton edit"
                  onClick={() => setProductForEdit(i)}
                >
                  <FaEye /> 
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
