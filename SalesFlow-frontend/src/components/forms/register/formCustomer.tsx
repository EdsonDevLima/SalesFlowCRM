import React, { useState } from "react";
import Style from "./formCustomer.module.css"
import { IoClose } from "react-icons/io5";
import api from "../../../service/api"; 
import type { IAddress } from "../../../types/customers";
import { toast } from "react-toastify";
import axios from "axios";

export function FormCustomer() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [password,setPassword] = useState<string>("")
  const [confirmPassword,setConfirmPassword] = useState<string>("")
  const [displayForm,setDisplayForm] = useState<boolean>(false)
  const [addresses, setAddresses] = useState<IAddress[]>([
    { street: "", number: "", city: "", state: "", zip: "" }
  ]);


  const formatCPF = (value: string) => {
 
    const numbers = value.replace(/\D/g, "");
    
   
    const limited = numbers.slice(0, 11);
    

    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    } else if (limited.length <= 9) {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    } else {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      { street: "", number: "", city: "", state: "", zip: "" }
    ]);
  };
  
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

  const handleForm = ()=>{
    if(displayForm){
        setDisplayForm(false)
    }else{
        setDisplayForm(true)
    }
  }


  const isAddressFilled = (address: IAddress) => {
    return address.street || address.number || address.city || address.state || address.zip;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      

    const filledAddresses = addresses.filter(isAddressFilled);
    
    const body = {
      name,
      email,
      cpf: cpf.replace(/\D/g, ""),
      password,
      confirmPassword: password,
      role: "customer"
    };

    if (filledAddresses.length > 0) {
      body.addresses = filledAddresses;
    }
    await api.post("/user/create", body);
      setDisplayForm(false)
      toast.success("Novo cliente cadastrado.")

    
    
     }catch (error: unknown) {
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
    <div className={Style.conteinerForm}>
      <button className="submitButton success" onClick={()=>handleForm()}>Cadastrar</button>
      {displayForm && <div onClick={()=>handleForm()} className={Style.modalFormcustomer}>
        <span className={Style.closeFormcustomer} onClick={()=>handleForm()}>
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
            
            <input type="submit" value="Cadastrar" className={Style.buttonRegister} />
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
      </div>}
    </div>
  );
}