import { WizardProvider } from "@/lib/wizard-context";
import { WizardContainer } from "@/components/wizard/wizard-container";

export default function Home() {
  return (
    <WizardProvider>
      <main className="min-h-screen w-full flex flex-col items-center p-4 py-10 sm:py-20 relative bg-zinc-950">
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 pointer-events-none dot-pattern opacity-30" />
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-indigo-500/10 via-transparent to-transparent" />

        <WizardContainer />
      </main>
    </WizardProvider>
  );
}
