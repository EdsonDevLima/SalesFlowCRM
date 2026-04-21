import Style from "./customerList.module.css";
import { useEffect, useState, useCallback } from "react";
import type { ICustomer } from "../../types/customers";
import api from "../../service/api";
import { FaEye } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { FormCustomer } from "../forms/register/formCustomer";
import { CustomerFormEdit } from "../forms/edit/customersEdit";
import { SearchCustomers } from "../search/searchCustomers";
import { toast } from "react-toastify";
import axios from "axios";
import { ListLoading } from "../load/ListLoading";

export function CustomersList() {
  const [allCustomers, setAllCustomers] = useState<ICustomer[]>([]);
  const [removeList, setRemoveList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [customerEditing, setCustomerEditing] = useState<ICustomer | null>(null)
  const [search,setSearch] = useState<string>("")

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
      return;
    }

    if (!confirm(`Deseja remover ${removeList.length} cliente(s)?`)) {
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        removeList.map((id) => api.delete(`user/${id}`))
      );

      setAllCustomers((prev) =>
        prev.filter((customer) => !removeList.includes(customer.id || 0))
      );

      setRemoveList([]);
    }catch (error: unknown) {
      let message = "Erro ao remover cliente";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }

      toast.error(message);
} finally {
      setLoading(false);
    }
  };
    const filteredCustomers = allCustomers.filter((customer) =>
  customer.name?.toLowerCase().includes(search.toLowerCase()) ||
  customer.id.toString().includes(search)
)

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return (
    <div>
      <div className="header-actions">
        <FormCustomer onCustomerCreated={getCustomers} />
        <SearchCustomers value={search} onChange={setSearch} />
        <button
          className="submitButton error"
          onClick={handleDeleteSelected}
          disabled={removeList.length === 0 || loading}
        >
          <CiTrash />
          {removeList.length > 0 && ` (${removeList.length})`}
        </button>
      </div>

      {loading ? <ListLoading text="Carregando clientes..." /> : filteredCustomers.length > 0  ? <div className="list">
        {filteredCustomers.map((i) => (
          <div key={i.id} className={`card-list ${Style.customerCard}`}>
            <label className={Style.checkboxWrapper + ` checkbox-wrapper`}>
              <input
                type="checkbox"
                checked={removeList.includes(i.id || 0)}
                onChange={() => changeRemoveList(i.id || 0)}
              />
              <span className="custom-checkbox"></span>
            </label>

            <div className={Style.aditionalInfor}>
              <p>Cód: {i.id}</p>
              <p>{i.name}</p>
              <p>{i.email}</p>
            </div>

            <div className={Style.ConteinerButton}>
                <button
                  className="submitButton edit"
                  onClick={() => setCustomerEditing(i)}
                >
                  <FaEye />
                </button>
            </div>
          </div>
        ))}
      </div> :<p className={Style.nother}>Nenhum cliente cadastrado</p>}
            {customerEditing && (
              <CustomerFormEdit
                Customers={customerEditing}
                displayModal={true}
                onClose={() => setCustomerEditing(null)}
                onUpdated={getCustomers}
              />
            )}
    </div>
  );
}
