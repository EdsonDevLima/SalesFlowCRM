import { HeaderWorkspace } from "../../components/headers/workspaceHeader";
import { ProductEntryReport } from "../../components/reports/ProductEntryReport";
import { ProductExitReport } from "../../components/reports/ProductExitReport";
import { UsersReport } from "../../components/reports/UsersReport";
import Styles from "./dashboard.module.css"

export function Dashboard(){
    return <>
    <HeaderWorkspace/>
    <section className={Styles.sectionReports}>
        <ProductEntryReport/>
        <ProductExitReport/>
        <UsersReport/>
    </section></>
}