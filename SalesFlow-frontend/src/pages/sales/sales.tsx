import { useContext, useEffect } from "react";
import { HeaderWorkspace } from "../../components/headers/workspaceHeader";
import { SalesList } from "../../components/list/salesList";
import { ContextUserApp } from "../../context/contextApp";

export function Sales(){
            const context = useContext(ContextUserApp)
            useEffect(()=>{
                context.verifyToken()
            },[])
   return <>
    <HeaderWorkspace/>
    <SalesList/>
    </>
}