import Style from "./searchSales.module.css"
import { IoSearch } from "react-icons/io5";
export function SearchSales(){
    return <div className={Style.SearchSales}>
    <input type="text" placeholder="Buscar produto"/>
    <button>
    <IoSearch />
    </button>
    </div>
}