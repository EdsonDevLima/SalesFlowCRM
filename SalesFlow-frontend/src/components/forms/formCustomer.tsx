import React, { useState } from "react";
import Style from "./formCustomer.module.css"
import { IoClose } from "react-icons/io5";
import api from "../../service/api";

export function FormCustomer() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password,setPassword] = useState<string>("")
  const [displayForm,setDisplayForm] = useState<boolean>(false)

  const handleForm = ()=>{
    if(displayForm){
        setDisplayForm(false)
    }else{
        setDisplayForm(true)
    }

  }
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    
    const body = {
    name,
    email,
    password,
    confirmPassword:password,
    role:"customer"
    }
     api.post("/user/create",body)
    

  };

  return (

    <div className={Style.conteinerForm}>
    <button className="submitButton success" onClick={()=>handleForm()}>Cadastrar</button>
    {displayForm && <div onClick={()=>handleForm()} className={Style.modalFormcustomer}>
      <span className={Style.closeFormcustomer} onClick={()=>handleForm()}>
        <IoClose />
      </span>
      <form onClick={(e) => e.stopPropagation()}  onSubmit={handleSubmit}>
        <h2>Cadastrar cliente.</h2>
        
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
          <input type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Senha:
          <input type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        
        
        <input type="submit" value="Cadastrar" className={Style.buttonRegister} />
      </form>
    </div>}</div>
  );
}