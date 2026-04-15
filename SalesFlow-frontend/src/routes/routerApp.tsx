import { Route, Routes } from "react-router-dom";
import { Products } from "../pages/products/products";
import { Customers } from "../pages/customers/customers";
import { Sales } from "../pages/sales/sales";
import { Dashboard } from "../pages/dashboard/dashboard";
import {Auth} from "../pages/auth/auth";

export function RouterApp() {
  
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/products" element={<Products />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}