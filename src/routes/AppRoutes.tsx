import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerListPage } from "../customers/pages/CustomerListPage";
import { CustomerFormPage } from "../customers/pages/CustomerFormPage";
import { LoginPage } from "../auth/pages/LoginPage";
import { ProtectedRoute } from "../auth/components/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CustomerListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/new"
          element={
            <ProtectedRoute>
              <CustomerFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/edit/:id"
          element={
            <ProtectedRoute>
              <CustomerFormPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};