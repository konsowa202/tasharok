import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Cairo } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
});

// Heavy display face for headlines — stands in for GT America Arabic Black (900)
// until licensed GT America Arabic files are dropped into public/fonts/.
const cairoDisplay = Cairo({
  subsets: ['arabic'],
  weight: ['700', '900'],
  variable: '--font-cairo-display',
});

export const metadata: Metadata = {
  title: 'تشارك - منصة الشراء الجماعي الرقمية | Tasharok',
  description:
    'أول منصة شراء جماعي تربط المشتري والمورد بخصومات تجارية استثنائية عند اكتمال العدد المطلوب',
  icons: {
    icon: '/logo-02.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexArabic.variable} ${cairoDisplay.variable} h-full antialiased font-arabic`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 selection:bg-[#22BC9F] selection:text-white font-arabic">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
