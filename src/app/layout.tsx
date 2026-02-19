import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Farcaster Mini App Embed Configuration
const frame = {
  version: "1",
  imageUrl: `${appUrl}/images/og-image.png`,
  button: {
    title: "🚀 Enter Grid",
    action: {
      type: "launch_frame",
      name: "KAINOVA Agent Grid",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash-icon.png`,
      splashBackgroundColor: "#0a0a0f",
    },
  },
};

export const metadata: Metadata = {
  title: "KAINOVA | Agent Grid",
  description: "Complete tasks, earn KNTWS tokens, and climb the Agent Grid. The ultimate Farcaster mini-app for AI agent enthusiasts.",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "KAINOVA Agent Grid",
    description: "Complete tasks, earn KNTWS tokens, and climb the Agent Grid",
    images: [`${appUrl}/images/og-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAINOVA Agent Grid",
    description: "Complete tasks, earn KNTWS tokens, and climb the Agent Grid",
    images: [`${appUrl}/images/og-image.png`],
  },
  other: {
    "fc:miniapp": JSON.stringify(frame),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-kainova-dark antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
