/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Ajoute 'serif' comme option par défaut pour les titres élégants
        // Assurez-vous d'importer la police dans votre fichier CSS principal ou index.html
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'], // Vous pouvez garder une police sans-serif pour le reste du texte
      },
      colors: {
        // Ajout des couleurs personnalisées pour correspondre à "Capture.PNG"
        tradition: {
          green: '#15803d', // Vert pour Tradipraticiens
          gold: '#ca8a04',  // Jaune/Or pour Herboristes
        },
      },
    },
  },
  plugins: [],
}