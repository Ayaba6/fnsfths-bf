import { useState, useEffect, useMemo } from "react"
import { supabase } from "../../services/supabase" // Chemin mis à jour vers votre client Supabase
import { Search, MapPin, Award, Phone, UserCheck, Filter, BookOpen, Users, Sparkles, ArrowUpRight } from "lucide-react"
import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"

export default function PublicPage() {
  const [praticiens, setPraticiens] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("Toutes")

  useEffect(() => {
    fetchPraticiens()
  }, [])

  async function fetchPraticiens() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("praticiens")
        .select("*")

      if (error) throw error
      setPraticiens(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des praticiens :", error.message)
    } finally {
      setLoading(false)
    }
  }

  // Extraire dynamiquement la liste de toutes les régions uniques pour le filtre
  const regions = useMemo(() => {
    const list = ["Toutes", ...new Set(praticiens.map(p => p.region))]
    return list.filter(Boolean)
  }, [praticiens])

  // Filtrer les praticiens selon la recherche textuelle et la région sélectionnée
  const filteredPraticiens = useMemo(() => {
    return praticiens.filter((p) => {
      const search = searchTerm.toLowerCase()
      const matchesSearch = (
        p.nom?.toLowerCase().includes(search) ||
        p.prenom?.toLowerCase().includes(search) ||
        p.telephone?.toLowerCase().includes(search) ||
        p.specialite?.toLowerCase().includes(search) ||
        p.region?.toLowerCase().includes(search) ||
        p.numero_ordre?.toLowerCase().includes(search)
      )
      const matchesRegion = selectedRegion === "Toutes" || p.region === selectedRegion
      return matchesSearch && matchesRegion
    })
  }, [praticiens, searchTerm, selectedRegion])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* En-tête du site */}
      <PublicHeader />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        
        {/* BANNIÈRE DESIGN AVEC RECHERCHE ET FILTRE INTÉGRÉS */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-[2.5rem] p-8 sm:p-12 mb-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 text-green-700/20 pointer-events-none">
            <BookOpen size={400} strokeWidth={1} />
          </div>

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Texte et barre de recherche/filtre */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-400 bg-green-950/60 border border-green-700/50 py-1.5 px-3.5 rounded-full mb-6 backdrop-blur-sm">
                <Sparkles size={14} /> Annuaire Officiel FNSTHS/BF
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4 tracking-tight">
                Répertoire des <span className="text-yellow-400">Tradipraticiens</span> Certifiés
              </h1>
              <p className="text-green-100 text-base sm:text-lg font-light leading-relaxed mb-8">
                Consultez la liste officielle des professionnels de la santé traditionnelle et herboristes agréés du Burkina Faso, garantissant sécurité et conformité.
              </p>

              {/* Barre de recherche et filtre par région intégrés dans la bannière */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-lg">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, prénom, téléphone, n°..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none bg-transparent"
                  />
                </div>

                <div className="relative sm:w-56 border-t sm:border-t-0 sm:border-l border-gray-100 pl-0 sm:pl-2">
                  <Filter className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <select 
                    className="w-full pl-11 pr-8 py-3 rounded-xl text-slate-800 text-sm focus:outline-none appearance-none bg-transparent cursor-pointer font-medium"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    {regions.map(r => (
                      <option key={r} value={r}>
                        {r === "Toutes" ? "Toutes les régions" : r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Illustration visuelle style Registre National à droite */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
              <div className="w-full max-w-xs bg-green-950/40 border border-green-700/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-green-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-yellow-400" size={22} />
                    <span className="font-serif font-bold text-sm tracking-wide text-white">Registre National</span>
                  </div>
                  <span className="text-xs bg-green-800/80 text-green-200 px-2.5 py-0.5 rounded-full font-semibold">Officiel</span>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-green-900/60 p-3 rounded-2xl border border-green-700/30 flex items-center gap-3">
                    <div className="w-9 h-9 bg-yellow-400/20 text-yellow-400 rounded-xl flex items-center justify-center font-bold text-xs">
                      FN
                    </div>
                    <div className="flex-grow">
                      <div className="h-2.5 bg-white/40 rounded w-3/4 mb-1.5"></div>
                      <div className="h-2 bg-yellow-400/60 rounded w-1/2"></div>
                    </div>
                    <UserCheck className="text-green-400 shrink-0" size={18} />
                  </div>

                  <div className="bg-green-900/60 p-3 rounded-2xl border border-green-700/30 flex items-center gap-3 opacity-80">
                    <div className="w-9 h-9 bg-white/10 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                      BF
                    </div>
                    <div className="flex-grow">
                      <div className="h-2.5 bg-white/40 rounded w-2/3 mb-1.5"></div>
                      <div className="h-2 bg-white/20 rounded w-2/5"></div>
                    </div>
                    <UserCheck className="text-green-400 shrink-0" size={18} />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-gray-300">
                  <span className="flex items-center gap-1"><Users size={14} className="text-yellow-400" /> Base vérifiée</span>
                  <span className="text-yellow-400 font-semibold">13 Régions</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Compteur de résultats & réinitialisation */}
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-sm font-medium text-slate-500">
            Affichage de <span className="font-bold text-slate-900">{filteredPraticiens.length}</span> praticien{filteredPraticiens.length > 1 ? 's' : ''} enrôlé{filteredPraticiens.length > 1 ? 's' : ''}
          </p>
          {(searchTerm || selectedRegion !== "Toutes") && (
            <button 
              onClick={() => { setSearchTerm(""); setSelectedRegion("Toutes"); }}
              className="text-xs font-semibold text-green-700 hover:text-green-800 underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Grille des praticiens */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium bg-white rounded-3xl border border-gray-100 shadow-sm">
            Chargement de l'annuaire en cours...
          </div>
        ) : filteredPraticiens.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
            <p className="text-gray-800 font-bold text-lg mb-1">Aucun praticien trouvé</p>
            <p className="text-gray-400 text-sm mb-6">Aucun résultat ne correspond à vos critères de recherche.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedRegion("Toutes"); }}
              className="bg-green-800 text-white font-semibold text-sm py-2.5 px-5 rounded-xl hover:bg-green-900 transition"
            >
              Voir tous les praticiens
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPraticiens.map((praticien) => (
              <div 
                key={praticien.id} 
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-900 uppercase group-hover:text-green-800 transition-colors">
                        {praticien.nom} <span className="font-normal capitalize">{praticien.prenom}</span>
                      </h3>
                      <span className="inline-block mt-1.5 px-3 py-1 bg-green-50 text-green-800 text-xs font-semibold rounded-full border border-green-100">
                        {praticien.specialite || "Tradipraticien / Herboriste"}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-800 flex-shrink-0 font-bold shadow-inner">
                      {praticien.nom ? praticien.nom.charAt(0) : "P"}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm text-slate-600 mb-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    {praticien.region && (
                      <div className="flex items-center gap-2.5">
                        <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-700">Région : {praticien.region}</span>
                      </div>
                    )}
                    {praticien.telephone && (
                      <div className="flex items-center gap-2.5">
                        <Phone size={16} className="text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-700">{praticien.telephone}</span>
                      </div>
                    )}
                    {praticien.numero_ordre && (
                      <div className="flex items-center gap-2.5">
                        <Award size={16} className="text-slate-400 flex-shrink-0" />
                        <span className="text-xs bg-white px-2.5 py-1 rounded-lg text-slate-700 font-mono border border-slate-200 shadow-2xs">
                          N° : {praticien.numero_ordre}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-green-700 font-medium">
                    <UserCheck size={14} /> Membre Enrôlé
                  </span>
                  {praticien.telephone ? (
                    <a 
                      href={`tel:${praticien.telephone}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-800 hover:text-white py-1.5 px-3 rounded-xl transition-all"
                    >
                      Contacter <ArrowUpRight size={13} />
                    </a>
                  ) : (
                    <span>FNSTHS-BF</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Pied de page du site */}
      <PublicFooter />
    </div>
  )
}