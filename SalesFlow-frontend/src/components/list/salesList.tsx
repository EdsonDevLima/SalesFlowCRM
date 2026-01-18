import { useEffect, useState, useCallback } from "react"
import type { SalesResult } from "../../types/sales"; 
import api from "../../service/api"
import { FaEye } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { FormSales } from "../forms/formSales";
import Style from "./salesList.module.css"

export function SalesList() {
  const [allSales, setAllSales] = useState<SalesResult[]>([]);
  const [removeList, setRemoveList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const changeRemoveList = (value: number) => {
    setRemoveList((prevList) => {
      const exists = prevList.includes(value);
      if (exists) {
        return prevList.filter((i) => i !== value);
      } else {
        return [...prevList, value];
      }
    });
  };

  const getSales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("sales/all");
      const data = (response.data as SalesResult[]) || [];
      setAllSales(data);
      console.log("vendas",allSales,data)
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      setAllSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteSelected = async () => {
    if (removeList.length === 0) {
      alert("Selecione pelo menos uma venda para remover");
      return;
    }

    if (!confirm(`Deseja realmente remover ${removeList.length} venda(s)?`)) {
      return;
    }

    try {
      setLoading(true);
      

      await Promise.all(
        removeList.map((id) => api.delete(`Sales/${id}`))
      );
      

      setAllSales((prevSales) => 
        prevSales.filter((sale) => !removeList.includes(sale.id))
      );
      

      setRemoveList([]);
      
      alert("Vendas removidas com sucesso!");
    } catch (error) {
      console.error("Erro ao remover vendas:", error);
      alert("Erro ao remover vendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSales();
    console.log(allSales)
  }, [getSales]);

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="header-actions">
        <FormSales onSaleAdded={getSales} />
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

      <div className={Style.SalesList}>
        {allSales.length === 0 && !loading ? (
          <p>Nenhuma venda encontrada</p>
        ) : (
          allSales.map((i) => (
            <div 
              key={i.id} 
              className={Style.cardSales}
            >
              <label className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  checked={removeList.includes(i.id || 0)}
                  onChange={() => i.id && changeRemoveList(i.id)}
                />
                <span className="custom-checkbox"></span>
              </label>

             <div className={Style.aditionalInfor}>
                <p>Id: {i.id}</p>
                <p>Cliente: {i.user?.name}</p>
                <p>Produtos: {i.products?.map(p => p.name).join(', ') || 'Nenhum'}</p>
                <p className={Style.date}>{formatDate(i.created_at)}</p>
                <p className={Style.status}>Status: {i.status === 'pending' ? 'Pendente' : 'Concluído'}</p>
              <p><strong>Total: {formatCurrency(`${i.total}`)}</strong></p>
              </div>

              <div className={Style.ConteinerButton}>
                <button className="submitButton edit" >
                  <FaEye />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}