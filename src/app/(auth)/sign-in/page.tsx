import { SignInForm } from "@/components/sign-in-form";

const SignInPage = () => {
  return (
    <main className="min-h-screen bg-[#eef5f9] px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-md border-y border-dashed border-cyan-200 py-10">
        <header className="text-center">
          <h1 className="text-4xl font-medium text-foreground sm:text-5xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Resume your adventure with Wanderlust
          </p>
        </header>
        <div className="mt-8 rounded-xl border border-border/60 bg-white p-6 shadow-sm sm:p-7">
          <SignInForm />
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
