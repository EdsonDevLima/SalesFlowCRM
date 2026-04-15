import Style from "./searchProducts.module.css"
import { IoSearch } from "react-icons/io5";
export function SearchProduct(){
    return <div className={Style.SearchProduct}>
    <input type="text" placeholder="Buscar produto"/>
    <button>
    <IoSearch />
    </button>
    </div>
}