import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"
import { Sprout, Beaker, Users, ShieldCheck, Target, Award, Quote, MapPin } from "lucide-react"
import aboutHeroImage from "../../assets/about-hero.jpg"
// Correction de l'extension si nécessaire, assurez-vous qu'elle correspond à votre fichier réel (.jpg ou .jpeg)
import presidentImage from "../../assets/president.jpeg" 

export default function About() {
  const axes = [
    { title: "Biodiversité médicinale", icon: Sprout, desc: "Sauvegarder les espèces végétales locales." },
    { title: "Modernisation", icon: Beaker, desc: "Vers une approche scientifique et sécurisée." },
    { title: "Collaboration", icon: Users, desc: "Synergie avec la médecine moderne." },
    { title: "Encadrement", icon: ShieldCheck, desc: "Défense et professionnalisation du métier." }
  ];

  const keyFigures = [
    { number: "500+", label: "Praticiens membres" },
    { number: "13", label: "Régions représentées" },
    { number: "2020", label: "Année de création" },
    { number: "100%", label: "Engagement naturel" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      <PublicHeader />

      <main className="flex-grow">
        {/* HÉROS AVEC IMAGE DE FOND */}
        <section className="relative h-[400px] flex items-center justify-center">
          <img 
            src={aboutHeroImage} 
            alt="À propos de la FNSTHS/BF" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative z-10 text-center px-6 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">À propos de la FNSTHS/BF</h1>
            <p className="text-lg sm:text-xl text-gray-200 font-light">
              Créée en 2020, la FNSTHS/BF est l'organisation de référence pour structurer, 
              sécuriser et valoriser la pharmacopée traditionnelle au Burkina Faso.
            </p>
          </div>
        </section>

        {/* CONTENU PRINCIPAL */}
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

          {/* MOT DU PRÉSIDENT (Ajusté ici) */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 shadow-xl relative overflow-hidden mt-16">
            {/* Icône de citation en arrière-plan */}
            <div className="absolute -top-10 -right-10 text-green-50 pointer-events-none">
              <Quote size={200} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
              {/* Badge du titre */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 py-1.5 px-3.5 rounded-full mb-10">
                <Award size={14} /> Le Mot du Président
              </div>

              {/* Photo, Nom et Titre (Ensemble centré) */}
              <div className="flex flex-col items-center mb-10">
                <div className="w-48 h-48 mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white ring-4 ring-green-100 bg-slate-100">
                  <img 
                    src={presidentImage} 
                    alt="M. ZOUNGRANA Moussa, Président de la FNSTHS/BF" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-serif font-bold text-2xl text-slate-900">M. ZOUNGRANA Moussa</h4>
                <p className="text-sm text-green-700 font-semibold tracking-wide uppercase mt-1">Président de la FNSTHS/BF</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 bg-gray-100 py-1 px-3 rounded-full">
                  <MapPin size={14} className="text-yellow-500" />
                  <span>Siège : Ouagadougou, Burkina Faso</span>
                </div>
              </div>

              {/* Discours (Texte justifié/centré) */}
              <div className="space-y-6 text-slate-700 text-base sm:text-lg font-medium leading-relaxed italic border-t border-gray-100 pt-10 w-full">
                <p>
                  « Bâtir des ponts solides entre nos savoirs ancestraux et les exigences de la science moderne pour garantir la santé de tous les Burkinabè. »
                </p>
              </div>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed mt-6 text-left w-full">
                <p>
                  Chers concitoyens, chers membres et partenaires, la pharmacopée traditionnelle au Burkina Faso constitue un pan inestimable de notre patrimoine culturel et sanitaire. Trop longtemps laissée à l'empirisme, elle mérite aujourd'hui d'être encadrée, modernisée et valorisée à sa juste valeur.
                </p>
                <p>
                  À travers la FNSTHS/BF, notre combat quotidien est de fédérer les acteurs, de lutter contre les dérives, et de garantir la sécurité et la qualité des soins par la formation et la standardisation des pratiques. Ensemble, faisons de notre médecine un pilier incontournable et complémentaire de la santé publique en Afrique.
                </p>
              </div>
            </div>
          </div>
          
          {/* Section Chiffres Clés */}
          <div className="bg-green-900 text-white rounded-[2.5rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-lg">
            {keyFigures.map((fig, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-yellow-400">{fig.number}</div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">{fig.label}</div>
              </div>
            ))}
          </div>
          
          {/* Grille des Axes */}
          <div className="grid md:grid-cols-2 gap-6 pt-8">
            {axes.map((axe, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-green-200 transition-all group">
                <div className="w-14 h-14 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-700 group-hover:text-white transition-colors shadow-sm">
                  <axe.icon size={28} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{axe.title}</h3>
                <p className="text-slate-500 text-sm">{axe.desc}</p>
              </div>
            ))}
          </div>

          {/* Section Vision */}
          <div className="grid md:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Une vision scientifique et durable</h2>
              <p className="text-slate-600 leading-relaxed font-light">
                Nous œuvrons quotidiennement pour passer d'une approche empirique à une approche scientifique (dosage, hygiène, conservation), garantissant ainsi la sécurité des patients burkinabè. 
              </p>
              <p className="text-slate-600 leading-relaxed font-light">
                Notre engagement dépasse le cadre du soin : nous sommes acteurs de la souveraineté sanitaire nationale et de la protection de l'environnement.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-green-50/70 border border-green-100 rounded-2xl items-start">
                <Target className="text-green-700 shrink-0 mt-1" size={20} />
                <p className="text-sm text-green-900 font-medium"><strong>Mission :</strong> Fédérer les praticiens pour un accès aux soins de qualité et standardisés.</p>
              </div>
              <div className="flex gap-4 p-4 bg-yellow-50/70 border border-yellow-100 rounded-2xl items-start">
                <Award className="text-yellow-700 shrink-0 mt-1" size={20} />
                <p className="text-sm text-yellow-900 font-medium"><strong>Ambition :</strong> Devenir un pilier institutionnel indispensable de la santé publique au Burkina Faso et en Afrique.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  )
}