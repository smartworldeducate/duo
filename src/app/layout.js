import localFont from "next/font/local";
import "./globals.css";
import { ReduxProvider } from "@/redux/store";
import { FeedbackProvider } from "@/components/ui/Feedback";
import AppShell from "@/components/layout/AppShell";
import { BRAND } from "@/lib/constants";

const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: `${BRAND} · Admin Dashboard`,
  description: `${BRAND} matchmaking — admin control panel`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <ReduxProvider>
          <FeedbackProvider>
            <AppShell>{children}</AppShell>
          </FeedbackProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
