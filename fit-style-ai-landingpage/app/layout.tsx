import type { Metadata } from 'next'
import { Outfit, Noto_Sans_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit'
});

const notoSansKR = Noto_Sans_KR({ 
  subsets: ["latin"],
  variable: '--font-noto-sans-kr'
});

export const metadata: Metadata = {
  title: 'FitStyle AI - AI가 추천하는 나만의 코디',
  description: '체형 분석 기반 AI 스타일링 서비스. 사진 한 장으로 나에게 어울리는 코디를 찾아보세요.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${outfit.variable} ${notoSansKR.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
