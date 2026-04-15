import logo from "../../../public/logo.png";
import Style from "./authenticateHeader.module.css"
export function HeaderAuthenticate(){
    return <header className={Style.authenticateHeader}>
        <img src={logo} alt="logo"/>
        
    </header>
}