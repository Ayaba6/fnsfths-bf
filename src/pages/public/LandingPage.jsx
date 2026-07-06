import { Link } from "react-router-dom"
import { Sprout, Beaker, Users, ShieldCheck, ArrowRight } from "lucide-react"
import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"
import heroImage from "../../assets/hero-medicine.jpg"
import logoImage from "../../assets/logo.JPG";

export default function LandingPage() {
  const axes = [
    { icon: Sprout, title: "Biodiversité", desc: "Préservation des plantes médicinales et reforestation." },
    { icon: Beaker, title: "Modernisation", desc: "Approche scientifique, hygiène et dosage rigoureux." },
    { icon: Users, title: "Collaboration", desc: "Intégration dans le système de santé public." },
    { icon: ShieldCheck, title: "Encadrement", desc: "Lutte contre les dérives et reconnaissance pro." }
  ];

  const stats = [
    { label: "Tradipraticiens membres", value: "500+" },
    { label: "Localités couvertes", value: "45" },
    { label: "Années d'expérience", value: "6+" },
    { label: "Formations validées", value: "120" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicHeader />

      <main className="flex-grow">
        {/* HERO SECTION (Compacte) */}
        <section className="relative py-10 px-6 lg:px-20 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-green-50 text-green-700 font-medium text-sm mb-6 border border-green-100">
                <Sprout size={16} /> Burkina Faso
              </span>
              <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
                Fédération Nationale Sans Frontière des <br/>
                <span className="text-green-700">Tradipraticiens</span> et <span className="text-yellow-600">Herboristes</span><br/>
                de Santé
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Répertoire national des tradipraticiens et herboristes de santé du Burkina Faso. Valoriser la médecine traditionnelle au service du bien-être de tous.
              </p>
              <Link to="/annuaire" className="inline-flex items-center gap-2 px-8 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition shadow-lg shadow-green-700/20">
                Consulter l'annuaire <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-green-600 rounded-[2rem] rotate-3 opacity-10"></div>
              <img 
                src={heroImage} 
                alt="Médecine traditionnelle" 
                className="relative z-10 w-full h-[400px] object-cover rounded-[2rem] shadow-2xl" 
              />
            </div>
          </div>
        </section>

        {/* BLOC STATISTIQUES */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto bg-gray-900 rounded-[2rem] p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-green-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION MISSION */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif text-gray-900 mb-6">
                Notre <span className="text-green-700">Mission</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                La FNSFTHS a pour mission de recenser, organiser et valoriser les tradipraticiens et herboristes de santé sur l'ensemble du territoire burkinabè. Nous œuvrons pour la reconnaissance officielle de la médecine traditionnelle et sa complémentarité avec la médecine moderne.
              </p>
              <ul className="space-y-4">
                {[
                  "Répertorier tous les tradipraticiens du Burkina Faso",
                  "Délivrer des agréments et certifications",
                  "Promouvoir les bonnes pratiques en médecine traditionnelle",
                  "Faciliter la collaboration avec le système de santé national"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-50/50 p-12 rounded-[2rem] flex items-center justify-center border border-orange-100">
              <img src={logoImage} alt="Logo FNSFTHS" className="w-full max-w-sm object-contain" />
            </div>
          </div>
        </section>

        {/* AXES STRATÉGIQUES */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Titre responsive et vert */}
            <div className="flex flex-col items-center mb-16">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-1 bg-green-600 rounded-full"></div>
                <div className="w-4 h-1 bg-green-600 rounded-full"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center px-4">
                Nos Piliers d'Excellence
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {axes.map((axe, i) => (
                <div key={i} className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:bg-green-600 transition-all duration-300">
                  <div className="text-green-600 group-hover:text-white mb-6 transition-colors">
                    <axe.icon size={48} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-white transition-colors">{axe.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed group-hover:text-green-50 transition-colors">{axe.desc}</p>
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