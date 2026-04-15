import { useContext, useEffect } from "react";
import { HeaderWorkspace } from "../../components/headers/workspaceHeader";
import { ProductsList } from "../../components/list/productList";
import { ContextUserApp } from "../../context/contextApp";

export function Products(){
    const context = useContext(ContextUserApp)
    useEffect(()=>{
        context.verifyToken()
    },[])
    return <>    
    <HeaderWorkspace/>
    <ProductsList/>
    </>
}