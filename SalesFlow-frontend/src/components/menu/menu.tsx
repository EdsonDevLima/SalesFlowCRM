import { useState } from "react";
import Style from "./menu.module.css";
import { MdPointOfSale } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import { Link } from "react-router-dom";


export function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen,setIsModalOpen] = useState(false)
    return (
        <div className={`${Style.menuList} ${isModalOpen ? Style.openModal:""}`}>
        <div 
            onClick={() =>{ setIsOpen(!isOpen); setIsModalOpen(!isModalOpen)}}
            className={`${Style.menu} ${isOpen ? Style.isOpen : ""}`}
        >
            <span></span>
            <span></span>
            <span></span>
        </div>
        <ul>
            <li><Link to={"/sales"}>Vendas <MdPointOfSale /></Link></li>
            <li><Link to={"/customers"}>Clientes <RiCustomerService2Fill /></Link></li>
            <li><Link to={"/products"}>Produtos <MdOutlineProductionQuantityLimits /></Link></li>    
            <li><Link to={"/dashboard"}>Dashboard <BiSolidReport /></Link></li>      
        </ul>

        </div>
    );
}
