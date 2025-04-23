import ClientLayout from "@/Components/ClientLayout";

export const metadata = {
  title: "PANEL DE CONTROL - COV",
};

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
