import Style from "./customerList.module.css";
import { useEffect, useState, useCallback } from "react";
import type { ICustomer } from "../../types/customers";
import api from "../../service/api";
import { FaEye } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { FormCustomer } from "../forms/formCustomer";

export function CustomersList() {
  const [allCustomers, setAllCustomers] = useState<ICustomer[]>([]);
  const [removeList, setRemoveList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const changeRemoveList = (id: number) => {
    setRemoveList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("user/customers");
      const data = (response.data.items as ICustomer[]) || [];
      setAllCustomers(data);
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
      setAllCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteSelected = async () => {
    if (removeList.length === 0) {
      alert("Selecione pelo menos um cliente");
      return;
    }

    if (!confirm(`Deseja remover ${removeList.length} cliente(s)?`)) {
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        removeList.map((id) => api.delete(`user/customers/${id}`))
      );

      setAllCustomers((prev) =>
        prev.filter((customer) => !removeList.includes(customer.id || 0))
      );

      setRemoveList([]);
      alert("Clientes removidos com sucesso!");
    } catch (error) {
      console.error("Erro ao remover clientes", error);
      alert("Erro ao remover clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return (
    <div>
      <div className="header-actions">
        <FormCustomer />

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

      <div className="list">
        {allCustomers.map((i) => (
          <div key={i.id} className={`card-list ${Style.customerCard}`}>
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={removeList.includes(i.id || 0)}
                onChange={() => changeRemoveList(i.id || 0)}
              />
              <span className="custom-checkbox"></span>
            </label>

            <div className={Style.aditionalInfor}>
              <p>Id: {i.id}</p>
              <p>Cliente: {i.name}</p>
              <p>Email: {i.email}</p>
            </div>

            <div className={Style.ConteinerButton}>
              <button className="submitButton edit">
                <FaEye />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
