import { useContext, useEffect } from "react";
import { HeaderWorkspace } from "../../components/headers/workspaceHeader";
import { CustomersList } from "../../components/list/customerList";
import { ContextUserApp } from "../../context/contextApp";

export function Customers(){
        const context = useContext(ContextUserApp)
        useEffect(()=>{
            context.verifyToken()
        },[])
    return <>
    <HeaderWorkspace/>
    <CustomersList/>
    </>
}