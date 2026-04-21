export default function ContactPage() {
  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <p className="mb-4">
        For orders or queries, contact us:
      </p>

      <p className="mb-2">📞 Phone: +91 8199829557</p>
      <p className="mb-2">📧 Email: cleaningstore@gmail.com</p>

      <a
        href="https://wa.me/919876543210"
        className="bg-green-500 text-white px-4 py-2 rounded inline-block mt-4"
      >
        Chat on WhatsApp
      </a>
    </main>
  );
}