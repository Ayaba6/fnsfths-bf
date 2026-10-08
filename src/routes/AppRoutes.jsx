import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"

// 🔥 COMPOSANT SCROLL TO TOP
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// 🔥 PAGES PUBLIQUES
import LandingPage from "../pages/public/LandingPage"
import PublicPage from "../pages/public/PublicPage"
import About from "../pages/public/About"
import Contact from "../pages/public/Contact"
import Login from "../pages/auth/Login"

import ProtectedRoute from "./ProtectedRoute"
import Layout from "../components/layout/Layout"

// 🔥 ADMIN & MUTUALISÉS
import AdminDashboard from "../pages/admin/AdminDashboard"
import PraticiensPage from "../pages/admin/PraticiensPage"
import AssociationsPage from "../pages/admin/AssociationsPage"
import ReseauxPage from "../pages/admin/ReseauxPage"
import AttestationManager from "../pages/admin/AttestationManager" // 👈 Import du composant Attestation

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
      <ScrollToTop />
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/annuaire" element={<PublicPage />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

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

        {/* ================= CARTES & ATTESTATIONS ================= */}
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

        <Route
          path="/admin/attestations"
          element={
            <ProtectedRoute allowedRoles={["admin_federation"]}>
              <Layout>
                <AttestationManager />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}