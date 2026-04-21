import { useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Products } from "../pages/products/products";
import { Customers } from "../pages/customers/customers";
import { Sales } from "../pages/sales/sales";
import { Dashboard } from "../pages/dashboard/dashboard";
import {Auth} from "../pages/auth/auth";
import { ContextUserApp } from "../context/contextApp";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { verifyToken } = useContext(ContextUserApp);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const valid = await verifyToken();
      setIsAllowed(valid);
    };

    checkAccess();
  }, [verifyToken]);

  if (isAllowed === null) {
    return null;
  }

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { verifyToken } = useContext(ContextUserApp);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const valid = await verifyToken();
      setIsAuthenticated(valid);
    };

    checkAccess();
  }, [verifyToken]);

  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function RouterApp() {
  
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
