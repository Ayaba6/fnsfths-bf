import { useEffect, useState, useMemo } from "react"
import { supabase } from "../../services/supabase"
import { Search, Phone, BadgeCheck, MapPin, Filter, Loader2, UserX, BookOpen, Users, Sparkles, ArrowUpRight } from "lucide-react"
import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"

export default function PublicPage() {
  const [praticiens, setPraticiens] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("Toutes")

  useEffect(() => {
    const fetchCertifies = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("praticiens")
        .select("*")
        .eq("statut", "certifie")
        .order("nom", { ascending: true })
      
      if (data) setPraticiens(data)
      if (error) console.error("Erreur lors du chargement de l'annuaire :", error.message)
      setLoading(false)
    }
    fetchCertifies()
  }, [])

  const regions = useMemo(() => {
    const list = ["Toutes", ...new Set(praticiens.map(p => p.region))]
    return list.filter(Boolean)
  }, [praticiens])

  const filtered = useMemo(() => {
    return praticiens.filter(p => {
      const searchTerm = search.toLowerCase()
      const fullName = `${p.nom || ""} ${p.prenom || ""}`.toLowerCase()
      const regionName = (p.region || "").toLowerCase()
      const adherentNum = (p.numero_adherent || "").toLowerCase()

      const matchesSearch = fullName.includes(searchTerm) || regionName.includes(searchTerm) || adherentNum.includes(searchTerm)
      const matchesRegion = selectedRegion === "Toutes" || p.region === selectedRegion
      return matchesSearch && matchesRegion
    })
  }, [praticiens, search, selectedRegion])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      <PublicHeader />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        
        {/* BANNIÈRE AVEC ILLUSTRATION D'ANNUAIRE À DROITE */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-[2.5rem] p-8 sm:p-12 mb-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 text-green-700/20 pointer-events-none">
            <BookOpen size={400} strokeWidth={1} />
          </div>

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Texte et barre de recherche */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-400 bg-green-950/60 border border-green-700/50 py-1.5 px-3.5 rounded-full mb-6 backdrop-blur-sm">
                <Sparkles size={14} /> Annuaire Officiel FNSTHS/BF
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4 tracking-tight">
                Répertoire des <span className="text-yellow-400">Tradipraticiens</span> Certifiés
              </h1>
              <p className="text-gray-200 text-base sm:text-lg font-light leading-relaxed mb-8">
                Consultez la liste officielle des professionnels de la santé traditionnelle et herboristes agréés du Burkina Faso, garantissant sécurité et conformité.
              </p>

              {/* Barre de recherche et filtres intégrée */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-lg">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher par nom, région ou n° d'adhérent..." 
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="relative sm:w-56 border-t sm:border-t-0 sm:border-l border-gray-100 pl-0 sm:pl-2">
                  <Filter className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <select 
                    className="w-full pl-11 pr-8 py-3 rounded-xl text-slate-800 text-sm focus:outline-none appearance-none bg-transparent cursor-pointer font-medium"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    {regions.map(r => <option key={r} value={r}>{r === "Toutes" ? "Toutes les régions" : r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Illustration visuelle style "Annuaire / Registre numérique" à droite */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-xs bg-green-950/40 border border-green-700/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-green-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-yellow-400" size={22} />
                    <span className="font-serif font-bold text-sm tracking-wide text-white">Registre National</span>
                  </div>
                  <span className="text-xs bg-green-800/80 text-green-200 px-2.5 py-0.5 rounded-full font-semibold">Officiel</span>
                </div>

                {/* Simulation de fiches d'annuaire en miniature */}
                <div className="space-y-2.5">
                  <div className="bg-green-900/60 p-3 rounded-2xl border border-green-700/30 flex items-center gap-3">
                    <div className="w-9 h-9 bg-yellow-400/20 text-yellow-400 rounded-xl flex items-center justify-center font-bold text-xs">
                      ZM
                    </div>
                    <div className="flex-grow">
                      <div className="h-2.5 bg-white/40 rounded w-3/4 mb-1.5"></div>
                      <div className="h-2 bg-yellow-400/60 rounded w-1/2"></div>
                    </div>
                    <BadgeCheck className="text-green-400 shrink-0" size={18} />
                  </div>

                  <div className="bg-green-900/60 p-3 rounded-2xl border border-green-700/30 flex items-center gap-3 opacity-80">
                    <div className="w-9 h-9 bg-white/10 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                      KA
                    </div>
                    <div className="flex-grow">
                      <div className="h-2.5 bg-white/40 rounded w-2/3 mb-1.5"></div>
                      <div className="h-2 bg-white/20 rounded w-2/5"></div>
                    </div>
                    <BadgeCheck className="text-green-400 shrink-0" size={18} />
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

        {/* STATISTIQUES RAPIDES */}
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-sm font-medium text-slate-500">
            Affichage de <span className="font-bold text-slate-900">{filtered.length}</span> praticien{filtered.length > 1 ? 's' : ''} certifié{filtered.length > 1 ? 's' : ''}
          </p>
          {(search || selectedRegion !== "Toutes") && (
            <button 
              onClick={() => { setSearch(""); setSelectedRegion("Toutes"); }}
              className="text-xs font-semibold text-green-700 hover:text-green-800 underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* ÉTAT DE CHARGEMENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="animate-spin text-green-700 mb-4" size={40} />
            <p className="text-slate-500 font-medium text-sm">Chargement sécurisé de l'annuaire...</p>
          </div>
        ) : filtered.length > 0 ? (
          /* GRILLE DES PRATICIENS */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div 
                key={p.id} 
                className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* En-tête de la carte */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center text-green-800 font-bold text-lg shrink-0 shadow-inner">
                        {p.prenom?.[0]}{p.nom?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-green-700 transition-colors">
                          {p.nom} {p.prenom}
                        </h3>
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1.5 border border-emerald-100">
                          <BadgeCheck size={13} />
                          <span>{p.numero_adherent || "N° non défini"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées */}
                  <div className="space-y-2.5 text-sm text-slate-600 mb-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <MapPin size={16} className="text-slate-400 shrink-0" /> 
                      <span className="font-medium text-slate-700">{p.region || "Région non précisée"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={16} className="text-slate-400 shrink-0" /> 
                      <span className="font-medium text-slate-700">{p.telephone || "Non renseigné"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Spécialités */}
                  {p.specialite && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {p.specialite.split(',').map((spec, i) => (
                        <span key={i} className="text-green-800 text-xs font-medium bg-green-50/80 border border-green-100 px-2.5 py-1 rounded-xl">
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bouton d'action / contact rapide si téléphone disponible */}
                  {p.telephone && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Membre vérifié</span>
                      <a 
                        href={`tel:${p.telephone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-700 hover:text-white py-2 px-3.5 rounded-xl transition-all"
                      >
                        Contacter <ArrowUpRight size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ÉTAT AUCUN RÉSULTAT */
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <UserX size={28} />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">Aucun tradipraticien trouvé</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Aucun résultat ne correspond à votre recherche "{search}" {selectedRegion !== "Toutes" ? `dans la région de ${selectedRegion}` : ""}.
            </p>
            <button 
              onClick={() => { setSearch(""); setSelectedRegion("Toutes"); }}
              className="bg-green-700 text-white font-semibold text-sm py-3 px-6 rounded-2xl hover:bg-green-800 transition-colors shadow-md shadow-green-700/20"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}