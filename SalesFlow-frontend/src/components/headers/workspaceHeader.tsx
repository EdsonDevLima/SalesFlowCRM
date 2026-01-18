import { Menu } from "../menu/menu"
import Style from "./workspaceHeader.module.css"
export function HeaderWorkspace(){
    return <header className={Style.workspaceHeader}>
            <Menu/>
    </header>
}