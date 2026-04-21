import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./components/CartProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}