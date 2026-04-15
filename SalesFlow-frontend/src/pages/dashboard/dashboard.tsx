import { useContext, useEffect, useState } from "react";
import { HeaderWorkspace } from "../../components/headers/workspaceHeader";
import { ProductEntryReport } from "../../components/reports/ProductEntryReport";
import { ProductExitReport } from "../../components/reports/ProductExitReport";
import { UsersReport } from "../../components/reports/UsersReport";
import { RecentCustomers } from "../../components/list/RecentCustomers"; 
import { RecentSales } from "../../components/list/RecentSales"; 
import { SalesFilter, type FilterOptions } from "../../components/filtrers/Salesfilter"; 

import Styles from "./dashboard.module.css"
import { ContextUserApp } from "../../context/contextApp";

export function Dashboard(){
        const context = useContext(ContextUserApp)
        useEffect(()=>{
            context.verifyToken()
        },[])
    const [salesFilters, setSalesFilters] = useState<FilterOptions>({
        period: "all",
        status: "all"
    })

    const handleFilterChange = (filters: FilterOptions) => {
        setSalesFilters(filters)
    }

    return <>
    <HeaderWorkspace/>
    <section className={Styles.sectionReports}>

        <SalesFilter onFilterChange={handleFilterChange} />

        <div className={Styles.conteinerNotification}>
            <h2>Últimos clientes cadastrados.</h2>
            <div className={Styles.conteinerListDashboard}>
                <RecentCustomers />
            </div>
        </div>
        <div className={Styles.conteinerNotification}>
            <h2>Últimos Pedidos.</h2>
            <div className={Styles.conteinerListDashboard}>
                <RecentSales filters={salesFilters} />
            </div>
        </div>
        <div className={Styles.conteinerNotification}>
            <h2>Produtos mais acessados.</h2>
            <div className={Styles.conteinerListDashboard}>
                <RecentSales filters={salesFilters} />
            </div>
        </div>
        <div className={Styles.conteinerReport}>
        <ProductEntryReport/>
        <ProductExitReport/>
        <UsersReport/>
        </div>
    </section></>
}