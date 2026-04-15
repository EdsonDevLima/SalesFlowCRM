import { useState } from "react";
import type { ICustomer } from "../../../types/customers";
import Style from "./customersEdit.module.css"; 
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import api from "../../../service/api";
import axios from "axios";

export function CustomerFormEdit({
  Customers,
  displayModal,
  onClose
}: {
  Customers: ICustomer;
  displayModal: boolean;
  onClose: () => void;
}) {
  if (!displayModal) return null;

  const [formData, setFormData] = useState<ICustomer>({
    ...Customers,
    adress: Customers.adress || {
      street: "",
      number: "",
      city: "",
      state: "",
      zip: ""
    }
  });

  const handleChange = (field: keyof ICustomer, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      adress: {
        ...prev.adress,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/user/update/${formData.id}`, formData);

      toast.success("Cliente atualizado com sucesso");
      onClose();

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro na requisição");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro desconhecido");
      }
    }
  };

  return (
    <div className={Style.modalFormcustomer} onClick={onClose}>
      
      <span className={Style.closeFormcustomer} onClick={onClose}>
        <IoClose />
      </span>

      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        
        <div className={Style.conteinerEmail}>
          <h2>Editar cliente</h2>

          <label>
            Nome:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </label>
          <input
          type="submit"
          value="Salvar alterações"
          className={Style.buttonRegister}
        />
        </div>

        <div>
          <h2>Endereço</h2>

          <div className={Style.addressBox}>
            <label>
              Rua:
              <input
                type="text"
                value={formData.adress?.street || ""}
                onChange={(e) =>
                  handleAddressChange("street", e.target.value)
                }
              />
            </label>

            <label>
              Número:
              <input
                type="text"
                value={formData.adress?.number || ""}
                onChange={(e) =>
                  handleAddressChange("number", e.target.value)
                }
              />
            </label>

            <label>
              Cidade:
              <input
                type="text"
                value={formData.adress?.city || ""}
                onChange={(e) =>
                  handleAddressChange("city", e.target.value)
                }
              />
            </label>

            <label>
              Estado:
              <input
                type="text"
                value={formData.adress?.state || ""}
                onChange={(e) =>
                  handleAddressChange("state", e.target.value)
                }
              />
            </label>

            <label>
              CEP:
              <input
                type="text"
                value={formData.adress?.zip || ""}
                onChange={(e) =>
                  handleAddressChange("zip", e.target.value)
                }
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}