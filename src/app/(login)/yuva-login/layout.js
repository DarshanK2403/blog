import "../../globals.css";

export const metadata = {
  title: "Login | Yuva Gujarat",
  description: "Only for admin",
  icons: { icon: "/yuva-gujarat.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
