import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"
import contactHeroImage from "../../assets/contact-hero.jpg" // Ajustez le chemin

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />

      <main className="flex-grow">
        {/* HERO SECTION AVEC IMAGE */}
        <section className="relative h-[300px] flex items-center justify-center mb-16">
          <img 
            src={contactHeroImage} 
            alt="Contact" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contactez-nous</h1>
            <p className="text-gray-200 text-lg">Nous sommes à votre disposition pour toute information.</p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* COLONNE 1 : FORMULAIRE */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-6">Envoyez-nous un message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom complet</label>
                  <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea rows="4" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20">
                  <Send size={18} /> Envoyer le message
                </button>
              </form>
            </div>

            {/* COLONNE 2 : INFOS ET CARTE */}
            <div className="space-y-8">
              {/* Coordonnées */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl"><MapPin className="text-green-600" /></div>
                  <div><p className="text-xs text-gray-400 uppercase">Adresse</p><p className="font-semibold">Ouagadougou, Burkina Faso</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl"><Phone className="text-green-600" /></div>
                  <div><p className="text-xs text-gray-400 uppercase">Téléphone</p><p className="font-semibold">+226 70 59 30 30</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl"><Clock className="text-green-600" /></div>
                  <div><p className="text-xs text-gray-400 uppercase">Horaires</p><p className="font-semibold">Lun - Ven : 08h - 17h</p></div>
                </div>
              </div>

              {/* Carte GPS */}
              <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-64">
                <iframe 
                  className="w-full h-full rounded-2xl"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123565.4851234!2d-1.579!3d12.365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDIxJzU0LjAiTiAxwrAzNCc0OC4wIlc!5e0!3m2!1sfr!2sbf!4v1600000000000!5m2!1sfr!2sbf" 
                  title="Siège FNSTHS"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}