import Style from "./searchCustomers.module.css"
import { IoSearch } from "react-icons/io5";
export function SearchCustomers(){
    return <div className={Style.SearchCustomers}>
    <input type="text" placeholder="Buscar produto"/>
    <button>
    <IoSearch />
    </button>
    </div>
}