import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/auth/Login"
import ProtectedRoute from "./ProtectedRoute"
import Layout from "../components/layout/Layout"

import AdminDashboard from "../pages/admin/AdminDashboard"
import PraticiensPage from "../pages/admin/PraticiensPage"
import ReseauxPage from "../pages/admin/ReseauxPage"
import AssociationsPage from "../pages/admin/AssociationsPage"

// 🆕 CARTES FNSTHS
import CarteList from "../pages/praticiens/CarteList"
import CartePDF from "../pages/praticiens/CartePDF"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ================= */}
        <Route path="/" element={<Login />} />

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin_federation"]}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= PRATICIENS ================= */}
        <Route
          path="/admin/praticiens"
          element={
            <ProtectedRoute allowedRoles={["admin_federation"]}>
              <Layout>
                <PraticiensPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= RESEAUX ================= */}
        <Route
          path="/admin/reseaux"
          element={
            <ProtectedRoute allowedRoles={["admin_federation"]}>
              <Layout>
                <ReseauxPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= ASSOCIATIONS ================= */}
        <Route
          path="/admin/associations"
          element={
            <ProtectedRoute allowedRoles={["admin_federation"]}>
              <Layout>
                <AssociationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= CARTES FNSTHS ================= */}

        {/* LISTE DES CARTES */}
        <Route
          path="/admin/praticiens/carte"
          element={
            <ProtectedRoute allowedRoles={["admin_federation"]}>
              <Layout>
                <CarteList />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* CARTE INDIVIDUELLE (PDF + EXPORT) */}
        <Route
          path="/admin/praticiens/carte/:id"
          element={
            <ProtectedRoute allowedRoles={["admin_federation"]}>
              <Layout>
                <CartePDF />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}