import DashboardLayout from "@/Components/DashboardLayout";
export const metadata = {
    title: "Colegados - COV",
  };

export default async function ColegiodoLayout({ children }) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
