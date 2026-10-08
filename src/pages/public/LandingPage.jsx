import { Link } from "react-router-dom"
import { Sprout, Beaker, Users, ShieldCheck, ArrowRight, CheckCircle2, Award } from "lucide-react"
import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"
import heroImage from "../../assets/hero-medicine.jpg"
import logoImage from "../../assets/logo.JPG"

export default function LandingPage() {
  const axes = [
    { 
      icon: Sprout, 
      title: "Biodiversité & Écologie", 
      desc: "Préservation des plantes médicinales locales et actions concrètes de reforestation au Burkina Faso." 
    },
    { 
      icon: Beaker, 
      title: "Modernisation & Sécurité", 
      desc: "Promotion d'une approche scientifique rigoureuse, amélioration de l'hygiène et standardisation des dosages." 
    },
    { 
      icon: Users, 
      title: "Intégration Sanitaire", 
      desc: "Création de passerelles et de synergies entre la médecine traditionnelle et le système de santé public." 
    },
    { 
      icon: ShieldCheck, 
      title: "Encadrement & Éthique", 
      desc: "Lutte active contre les dérives, délivrance d'agréments et valorisation de la reconnaissance professionnelle." 
    }
  ];

  const stats = [
    { label: "Tradipraticiens membres", value: "500+" },
    { label: "Localités couvertes", value: "45" },
    { label: "Années d'expérience", value: "6+" },
    { label: "Formations validées", value: "120" }
  ];

  // Liste des partenaires officiels / institutionnels
  const partners = [
    { name: "Ministère de la Santé", acronym: "MS", subtitle: "Burkina Faso" },
    { name: "Ministère de l'Environnement", acronym: "MEEVCC", subtitle: "Partenaire Écologie" },
    { name: "Laboratoire de Pharmacopée", acronym: "CNFR", subtitle: "Recherche & Validation" },
    { name: "Ordre des Pharmaciens", acronym: "ONPBF", subtitle: "Collaboration" },
    { name: "Chambre des Métiers", acronym: "UEMOA", subtitle: "Artisanat & Santé" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 overflow-x-hidden">
      <PublicHeader />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative py-20 lg:py-28 px-6 lg:px-20 bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white overflow-hidden">
          {/* Éléments décoratifs d'arrière-plan avec effet subtil */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] animate-pulse"></div>
          
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Texte Hero avec animation d'apparition douce */}
            <div className="lg:col-span-7 text-left transform transition-all duration-1000 translate-y-0 opacity-100">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-green-800/80 text-green-200 font-medium text-xs md:text-sm mb-6 border border-green-600/50 backdrop-blur-md shadow-lg">
                <Sprout size={16} className="text-yellow-400 animate-bounce" /> Burkina Faso • Reconnaissance Officielle
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight tracking-tight">
                Fédération Nationale des <br/>
                <span className="text-yellow-400 drop-shadow-sm">Tradipraticiens</span> et <span className="text-green-300">Herboristes</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-200 mb-8 leading-relaxed max-w-2xl font-light">
                Répertoire officiel et syndicat professionnel œuvrant pour la structuration, la valorisation et la sécurité de la médecine traditionnelle au service des populations.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/annuaire" className="inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-500 text-slate-950 rounded-xl font-bold hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-xl shadow-yellow-500/20">
                  Consulter l'annuaire <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                  Devenir membre
                </Link>
              </div>
            </div>
            
            {/* Image Hero avec effet de lueur et zoom progressif au survol */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-green-500 rounded-[2.55rem] blur-xl opacity-30 group-hover:opacity-55 transition duration-500"></div>
              <div className="relative bg-white p-3 rounded-[2rem] shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                <img 
                  src={heroImage} 
                  alt="Médecine traditionnelle et herboristerie" 
                  className="w-full h-[380px] sm:h-[420px] object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-[1.02]" 
                />
              </div>
            </div>

          </div>
        </section>

        {/* BLOC STATISTIQUES (Flottant / Chevauchement moderne avec effet dynamique au survol) */}
        <section className="px-6 -mt-10 relative z-20">
          <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 transition-all duration-300 hover:shadow-2xl">
            {stats.map((stat, i) => (
              <div key={i} className="pt-4 md:pt-0 transform transition-transform duration-300 hover:scale-105">
                <div className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-1">{stat.value}</div>
                <div className="text-slate-500 text-xs sm:text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION MISSION & APPROCHE (Effet de profondeur au scroll) */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="transition-all duration-700">
              <span className="text-green-700 font-semibold tracking-wider uppercase text-xs">Notre Engagement</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2 mb-6">
                Allier la sagesse des ancêtres aux exigences de la <span className="text-green-700">santé moderne</span>
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed font-light">
                La FNSFTHS rassemble les acteurs de la pharmacopée traditionnelle pour structurer la profession, garantir la traçabilité des soins et protéger la biodiversité végétale du pays.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Répertoire national certifié",
                  "Formations et ateliers continus",
                  "Normes d'hygiène et de dosage",
                  "Partenariat sanitaire public"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-green-50/50 p-3.5 rounded-xl border border-green-100/60 transition-all duration-300 hover:bg-green-100/70 hover:translate-x-1">
                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-70 -z-10 animate-pulse"></div>
              <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 max-w-md text-center transform transition-all duration-500 hover:scale-[1.02]">
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2 shadow-inner">
                  <img src={logoImage} alt="Logo FNSFTHS" className="w-full h-full object-contain rounded-xl" />
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">FNSFTHS</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Garant de la déontologie et de la promotion des tradipraticiens et herboristes reconnus au Burkina Faso.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 py-1.5 px-3 rounded-full">
                  <Award size={14} /> Institution Officielle
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* AXES STRATÉGIQUES (Cartes dynamiques au scroll / survol) */}
        <section className="py-24 px-6 bg-slate-100/70 border-t border-b border-slate-200/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-green-700 font-semibold tracking-wider uppercase text-xs">Piliers d'action</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2 mb-4">
                Nos Domaines d'Intervention
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Quatre axes majeurs pour encadrer, développer et pérenniser la médecine traditionnelle.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {axes.map((axe, i) => (
                <div 
                  key={i} 
                  className="group bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-6 group-hover:bg-green-700 group-hover:text-white transition-all duration-300 shadow-sm group-hover:rotate-6">
                      <axe.icon size={28} strokeWidth={1.8} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-green-700 transition-colors">
                      {axe.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {axe.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION APPEL À L'ACTION BAS DE PAGE */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-green-900 to-green-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-green-700 rounded-full blur-3xl opacity-50 transition-transform duration-700 group-hover:scale-125"></div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 relative z-10">
              Vous recherchez un professionnel certifié ?
            </h2>
            <p className="text-green-100 max-w-xl mx-auto mb-8 text-sm sm:text-base relative z-10 font-light">
              Accédez dès maintenant à notre annuaire officiel pour trouver un tradipraticien ou un herboriste agréé près de chez vous.
            </p>
            <div className="relative z-10">
              <Link to="/annuaire" className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 text-slate-950 rounded-xl font-bold hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-lg">
                Explorer l'annuaire national <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* CARROUSEL / BANDEAU DE LOGOS DE PARTENAIRES */}
        <section className="py-16 bg-slate-100/80 border-t border-slate-200/60 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Ils accompagnent et soutiennent nos initiatives au Burkina Faso
            </p>
          </div>

          <div className="relative w-full overflow-hidden flex items-center">
            {/* Dégradés latéraux pour estomper les bords du carrousel */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-100 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-100 to-transparent z-10 pointer-events-none"></div>

            {/* Conteneur défilant en boucle avec la classe Tailwind et pause au survol */}
            <div className="flex w-max animate-marquee gap-8 px-4 items-center hover:[animation-play-state:paused]">
              {/* On triple la liste pour assurer une boucle infinie ultra fluide */}
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 bg-white py-4 px-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 min-w-[240px] group flex-shrink-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 font-bold flex items-center justify-center text-sm group-hover:bg-green-700 group-hover:text-white transition-colors">
                    {partner.acronym}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-green-700 transition-colors">
                      {partner.name}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {partner.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}