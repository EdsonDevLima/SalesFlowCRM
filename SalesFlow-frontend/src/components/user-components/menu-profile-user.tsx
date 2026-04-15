import { CgProfile } from "react-icons/cg";
import Style from "./menu-profile-user.module.css"
import { useContext, useState } from "react";
import { ContextUserApp } from "../../context/contextApp";
export function MenuProfileUser(){
const {logout} = useContext(ContextUserApp)    

const [displayAction,setDisplayAction] = useState<boolean>(false)
return <div className={Style.menuProfileUserConteiner}>
    
    <button className={Style.buttonProfileConteiner} onClick={(e)=>e.preventDefault()}><CgProfile onClick={()=>setDisplayAction(!displayAction)}/>
{  displayAction &&      <ul className={Style.profileActions}>
            <li>Trocar senha</li>
            <li>Configurações</li>
            <li onClick={logout}>Sair</li>
        </ul>}
    </button>

</div>


}