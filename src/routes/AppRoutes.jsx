import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/auth/Login"
import ProtectedRoute from "./ProtectedRoute"
import Layout from "../components/layout/Layout"

// 🔥 ADMIN & MUTUALISÉS (ADMIN / RESEAU / ASSOCIATION)
import AdminDashboard from "../pages/admin/AdminDashboard"
import PraticiensPage from "../pages/admin/PraticiensPage"       // 👈 Mutualisé Admin, Réseau, Association
import AssociationsPage from "../pages/admin/AssociationsPage" // 👈 Mutualisé Admin et Réseau
import ReseauxPage from "../pages/admin/ReseauxPage"

// 🔥 RESEAUX
import ReseauDashboard from "../pages/reseau/ReseauDashboard"

// 🔥 ASSOCIATIONS
import AssociationDashboard from "../pages/association/AssociationDashboard"

// CARTE
import CarteList from "../pages/praticiens/CarteList"
import CartePDF from "../pages/praticiens/CartePDF"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route path="/" element={<Login />} />

        {/* ================= ADMIN ================= */}
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

        {/* ================= RESEAU ================= */}
        <Route
          path="/reseau"
          element={
            <ProtectedRoute allowedRoles={["reseau"]}>
              <Layout>
                <ReseauDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ ROUTE RÉSEAU PRATICIENS DYNAMIQUE */}
        <Route
          path="/reseau/praticiens"
          element={
            <ProtectedRoute allowedRoles={["reseau"]}>
              <Layout>
                <PraticiensPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ ROUTE RÉSEAU ASSOCIATIONS MUTUALISÉE */}
        <Route
          path="/reseau/associations"
          element={
            <ProtectedRoute allowedRoles={["reseau"]}>
              <Layout>
                <AssociationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= ASSOCIATION ================= */}
        <Route
          path="/association"
          element={
            <ProtectedRoute allowedRoles={["association"]}>
              <Layout>
                <AssociationDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ ROUTE ASSOCIATION PRATICIENS DYNAMIQUE */}
        <Route
          path="/association/praticiens"
          element={
            <ProtectedRoute allowedRoles={["association"]}>
              <Layout>
                <PraticiensPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ================= CARTES ================= */}
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