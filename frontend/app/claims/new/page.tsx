import Link from "next/link";
import { ClaimForm } from "@/components/claims/ClaimForm";

export default function NewClaimPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard/cs" className="text-sm text-gray-500 hover:text-gray-800">
          ← 대시보드
        </Link>
        <span className="text-yellow-500 font-bold text-lg">클레미</span>
      </header>
      <main className="p-6">
        <ClaimForm />
      </main>
    </div>
  );
}
