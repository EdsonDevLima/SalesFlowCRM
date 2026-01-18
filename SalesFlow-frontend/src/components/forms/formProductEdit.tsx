import type { IProducts } from "../../types/products";
import Style from "./formProductEdit.module.css"
export function FormProductEdit(props:IProducts){
    console.log(props)
    return <div className={Style.modalProductEdit}>

    </div>
}