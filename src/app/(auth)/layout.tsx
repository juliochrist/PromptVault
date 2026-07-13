import { GuestLayout } from "@/components/layout/guest-layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestLayout>{children}</GuestLayout>;
}
