import { IoIosNotifications } from "react-icons/io"
import { Menu } from "../menu/menu"
import Style from "./workspaceHeader.module.css"
import { MenuProfileUser } from "../user-components/menu-profile-user"
export function HeaderWorkspace(){
    return <header className={Style.workspaceHeader}>
            <Menu/>
            <button className={Style.IconNotification}><IoIosNotifications /></button>
            <MenuProfileUser/>
    </header>
}