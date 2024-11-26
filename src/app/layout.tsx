import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nimbus - Una App del Clima",
  description: "Sitio web desarrollado con el objetivo de proporcionar información detallada sobre los distintos parámetros climáticos de las diversas regiones de Argentina, permitiendo a los usuarios acceder a datos actualizados y precisos sobre las condiciones meteorológicas en todo el país.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
