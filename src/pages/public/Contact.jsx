import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2, MessageSquare } from "lucide-react"
import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"
import contactHeroImage from "../../assets/contact-hero.jpg"

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulation d'un envoi de message (vous pourrez y connecter Supabase ou une API d'emailing)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setFormData({ nom: "", email: "", telephone: "", sujet: "", message: "" })
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setSuccess(false), 5000)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      <PublicHeader />

      <main className="flex-grow">
        {/* HERO SECTION AVEC IMAGE */}
        <section className="relative h-[360px] flex items-center justify-center mb-16">
          <img 
            src={contactHeroImage} 
            alt="Contact FNSFTHS/BF" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65"></div>
          <div className="relative z-10 text-center px-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-400 bg-black/40 border border-yellow-400/30 py-1.5 px-3.5 rounded-full mb-4 backdrop-blur-sm">
              <MessageSquare size={14} /> Restons en contact
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4 tracking-tight">Contactez-nous</h1>
            <p className="text-gray-200 text-base sm:text-lg font-light leading-relaxed">
              Nous sommes à votre entière disposition pour toute information, adhésion ou partenariat avec la FNSFTHS/BF.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* COLONNE 1 : FORMULAIRE (7 colonnes) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative">
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Envoyez-nous un message</h3>
              <p className="text-slate-500 text-sm mb-8">Remplissez ce formulaire et notre équipe vous répondra dans les plus brefs délais.</p>
              
              {success && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 animate-fadeIn">
                  <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                  <div className="text-sm">
                    <span className="font-semibold block">Message envoyé avec succès !</span>
                    Merci de nous avoir contactés. Nous traiterons votre demande rapidement.
                  </div>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Nom complet</label>
                    <input 
                      type="text" 
                      name="nom"
                      required
                      placeholder="Ex: Jean Ouédraogo"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-slate-50/50 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Adresse Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="exemple@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-slate-50/50 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      name="telephone"
                      placeholder="+226 XX XX XX XX"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-slate-50/50 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Sujet</label>
                    <input 
                      type="text" 
                      name="sujet"
                      required
                      placeholder="Objet de votre message"
                      value={formData.sujet}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-slate-50/50 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Message</label>
                  <textarea 
                    rows="5" 
                    name="message"
                    required
                    placeholder="Écrivez votre message ici..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-slate-50/50 transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-4 rounded-2xl font-semibold hover:bg-green-800 transition-all shadow-lg shadow-green-700/20 disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* COLONNE 2 : INFOS ET CARTE (5 colonnes) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Coordonnées */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                <h4 className="font-serif font-bold text-xl text-slate-900 mb-2">Coordonnées du siège</h4>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 text-green-700 rounded-2xl shrink-0 mt-1">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Adresse</p>
                    <p className="font-medium text-slate-800">Ouagadougou, Burkina Faso</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 text-green-700 rounded-2xl shrink-0 mt-1">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Téléphone / Secrétariat</p>
                    <p className="font-medium text-slate-800">+226 70 53 30 30</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 text-green-700 rounded-2xl shrink-0 mt-1">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email officiel</p>
                    <p className="font-medium text-slate-800">contact@fnsfths-bf.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 text-green-700 rounded-2xl shrink-0 mt-1">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Horaires d'ouverture</p>
                    <p className="font-medium text-slate-800">Lundi - Vendredi : 08h00 - 17h00</p>
                  </div>
                </div>
              </div>

              {/* Carte GPS */}
              <div className="bg-white p-3 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden h-72">
                <iframe 
                  className="w-full h-full rounded-[2rem]"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123565.4851234!2d-1.579!3d12.365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDIxJzU0LjAiTiAxwrAzNCc0OC4wIlc!5e0!3m2!1sfr!2sbf!4v1600000000000!5m2!1sfr!2sbf" 
                  title="Siège FNSTHS/BF"
                  loading="lazy"
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