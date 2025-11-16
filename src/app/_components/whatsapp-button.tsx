export default function WhatsAppButton() {
  const phoneNumber = "393881734335";
  const message = encodeURIComponent("Ciao Talia Materassi, avrei una domanda");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-6 sm:bottom-6 z-30 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5f4f] hover:to-[#8b7463] text-white font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      title="Contattaci"
    >
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8l-2 2v-12h14v10z" />
      </svg>
    </a>
  );
}
