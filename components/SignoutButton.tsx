"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOut();
        router.refresh();
      }}
      className="text-sm font-medium text-gray-600 hover:text-black underline-offset-4 hover:underline"
    >
      Sign out
    </button>
  );
}
