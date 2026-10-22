import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | iGauchoBack",
  description: "Sign in to save plans, collaborate, and contribute roadmaps.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
