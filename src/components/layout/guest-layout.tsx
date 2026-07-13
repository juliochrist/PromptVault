interface GuestLayoutProps {
  children: React.ReactNode;
}

export function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-primary" />
        <span className="text-xl font-bold text-text">PromptVault</span>
      </div>
      {children}
    </div>
  );
}
