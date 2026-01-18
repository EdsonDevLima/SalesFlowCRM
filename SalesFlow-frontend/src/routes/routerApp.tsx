import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Products } from "../pages/products/products";
import { Customers } from "../pages/customers/customers";
import { Sales } from "../pages/sales/sales";
import { Dashboard } from "../pages/dashboard/dashboard";

export function RouterApp(){
    return <BrowserRouter>
    <Routes>
        <Route path="/products" element={<Products/>}/>
        <Route path="/customers" element={<Customers/>}/>
        <Route path="/sales" element={<Sales/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>
}