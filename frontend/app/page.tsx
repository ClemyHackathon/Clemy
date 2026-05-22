import Link from "next/link";
import { Factory, MessageSquareText, Store, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] md:bg-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-10">
        <div className="mb-14 pt-8">
          <p className="text-3xl font-bold text-cyan-600">Clemy</p>
          <h1 className="mt-8 text-2xl font-bold leading-8 text-gray-950">
            어떤 유형의
            <br />
            사용자이신가요?
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Link
            href="/claims"
            className="flex aspect-square flex-col items-center justify-center rounded-lg bg-gray-50 px-4 text-center transition hover:bg-cyan-50"
          >
            <div className="relative mb-7 h-20 w-20 text-sky-500">
              <Users className="absolute left-2 top-4 h-14 w-14 fill-sky-100 stroke-[1.8]" />
              <MessageSquareText className="absolute right-0 top-0 h-9 w-9 fill-blue-100 stroke-[1.8] text-blue-500" />
            </div>
            <span className="text-lg font-bold text-gray-950">클레임 요청자</span>
          </Link>

          <Link
            href="/dashboard/cs"
            className="flex aspect-square flex-col items-center justify-center rounded-lg bg-gray-50 px-4 text-center transition hover:bg-cyan-50"
          >
            <div className="relative mb-7 h-20 w-20 text-violet-500">
              <Store className="absolute inset-x-0 top-1 mx-auto h-16 w-16 fill-violet-100 stroke-[1.8]" />
              <Factory className="absolute bottom-0 left-4 h-10 w-10 fill-cyan-100 stroke-[1.8] text-cyan-600" />
            </div>
            <span className="text-lg font-bold text-gray-950">산업현장 관리자</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
