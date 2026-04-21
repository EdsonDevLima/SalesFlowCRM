import React, { useState } from "react";
import Style from "./formCustomer.module.css";
import { IoClose } from "react-icons/io5";
import api from "../../../service/api";
import type { IAddress } from "../../../types/customers";
import { toast } from "react-toastify";
import axios from "axios";
import { ButtonLoading } from "../../load/ButtonLoading";

type CreateCustomerDTO = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
  role: string;
  addresses?: IAddress[];
};

interface FormCustomerProps {
  onCustomerCreated?: () => Promise<void> | void;
}

export function FormCustomer({ onCustomerCreated }: FormCustomerProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState<IAddress[]>([
    { street: "", number: "", city: "", state: "", zip: "" }
  ]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 11);

    if (limited.length <= 3) return limited;
    if (limited.length <= 6)
      return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    if (limited.length <= 9)
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;

    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(
      6,
      9
    )}-${limited.slice(9)}`;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  // const addAddress = () => {
  //   setAddresses([
  //     ...addresses,
  //     { street: "", number: "", city: "", state: "", zip: "" }
  //   ]);
  // };

  const handleAddressChange = (
    index: number,
    field: keyof IAddress,
    value: string
  ) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const removeAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleForm = () => {
    setDisplayForm((prev) => !prev);
  };

  const isAddressFilled = (address: IAddress) => {
    return (
      address.street ||
      address.number ||
      address.city ||
      address.state ||
      address.zip
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // ✔ validação de senha
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const filledAddresses = addresses.filter(isAddressFilled);

      const body: CreateCustomerDTO = {
        name,
        email,
        cpf: cpf.replace(/\D/g, ""),
        password,
        confirmPassword,
        role: "customer"
      };

      if (filledAddresses.length > 0) {
        body.addresses = filledAddresses;
      }

      await api.post("/user/create", body);
      setName("");
      setEmail("");
      setCpf("");
      setPassword("");
      setConfirmPassword("");
      setAddresses([
        { street: "", number: "", city: "", state: "", zip: "" }
      ]);

      setDisplayForm(false);
      toast.success("Novo cliente cadastrado.");
      await onCustomerCreated?.();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro na requisição");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.conteinerForm}>
      <button type="button" className="submitButton success" onClick={handleForm}>
        Cadastrar
      </button>

      {displayForm && (
        <div onClick={handleForm} className={Style.modalFormcustomer}>
          <span className={Style.closeFormcustomer} onClick={handleForm}>
            <IoClose />
          </span>

          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <div className={Style.conteinerEmail}>
              <h2>Cadastrar cliente</h2>

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
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                CPF:
                <input
                  type="text"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </label>

              <label>
                Senha:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <label>
                Confirmação de senha:
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>

              <ButtonLoading
                loading={loading}
                text="Cadastrar"
                className={Style.buttonRegister}
              />
            </div>

            <div>
              <h2>Endereço (Opcional)</h2>

              {addresses.map((address, index) => (
                <div key={index} className={Style.addressBox}>
                  <label>
                    Rua:
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        handleAddressChange(index, "street", e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Número:
                    <input
                      type="text"
                      value={address.number}
                      onChange={(e) =>
                        handleAddressChange(index, "number", e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Cidade:
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        handleAddressChange(index, "city", e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Estado:
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) =>
                        handleAddressChange(index, "state", e.target.value)
                      }
                    />
                  </label>

                  <label>
                    CEP:
                    <input
                      type="text"
                      value={address.zip}
                      onChange={(e) =>
                        handleAddressChange(index, "zip", e.target.value)
                      }
                    />
                  </label>

                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className={Style.removeAddress}
                    >
                      Remover endereço
                    </button>
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
