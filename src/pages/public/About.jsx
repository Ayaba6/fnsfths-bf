import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"
import { Sprout, Beaker, Users, ShieldCheck, Target, Award } from "lucide-react"
import aboutHeroImage from "../../assets/about-hero.jpg" // Assurez-vous que le chemin est correct

export default function About() {
  const axes = [
    { title: "Biodiversité médicinale", icon: Sprout, desc: "Sauvegarder les espèces végétales locales." },
    { title: "Modernisation", icon: Beaker, desc: "Vers une approche scientifique et sécurisée." },
    { title: "Collaboration", icon: Users, desc: "Synergie avec la médecine moderne." },
    { title: "Encadrement", icon: ShieldCheck, desc: "Défense et professionnalisation du métier." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />

      <main className="flex-grow">
        {/* HÉROS AVEC IMAGE DE FOND */}
        <section className="relative h-[400px] flex items-center justify-center mb-16">
          <img 
            src={aboutHeroImage} 
            alt="À propos de la FNSTHS/BF" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative z-10 text-center px-6 max-w-3xl">
            <h1 className="text-5xl font-black text-white mb-6">À propos de la FNSTHS/BF</h1>
            <p className="text-xl text-gray-200">
              Créée en 2020, la FNSTHS/BF est l'organisation de référence pour structurer, 
              sécuriser et valoriser la pharmacopée traditionnelle au Burkina Faso.
            </p>
          </div>
        </section>

        {/* CONTENU PRINCIPAL */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          {/* Grille des Axes */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {axes.map((axe, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-green-200 transition-all group">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <axe.icon size={28} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{axe.title}</h3>
                <p className="text-gray-500 text-sm">{axe.desc}</p>
              </div>
            ))}
          </div>

          {/* Section Vision */}
          <div className="grid md:grid-cols-2 gap-12 items-center bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Une vision scientifique et durable</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous œuvrons quotidiennement pour passer d'une approche empirique à une approche scientifique (dosage, hygiène, conservation), garantissant ainsi la sécurité des patients burkinabè. 
              </p>
              <p className="text-gray-600 leading-relaxed">
                Notre engagement dépasse le cadre du soin : nous sommes acteurs de la souveraineté sanitaire nationale et de la protection de l'environnement.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-green-50 rounded-2xl">
                <Target className="text-green-600 shrink-0" />
                <p className="text-sm text-green-900"><strong>Mission :</strong> Fédérer les praticiens pour un accès aux soins de qualité.</p>
              </div>
              <div className="flex gap-4 p-4 bg-blue-50 rounded-2xl">
                <Award className="text-blue-600 shrink-0" />
                <p className="text-sm text-blue-900"><strong>Ambition :</strong> Devenir un pilier indispensable de la santé publique en Afrique.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}