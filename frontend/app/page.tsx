import Link from "next/link";
import { ClipboardList, Factory, MessageSquareText, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-10">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl font-bold text-yellow-500">클레미</span>
            <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
              AI 클레임 처리
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            역할에 맞는 화면으로 시작하세요
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            산업현장 관리자는 접수된 클레임의 유형과 원인 후보, 대응 우선순위를 한눈에 확인하고,
            클레임 요청자는 기존 게시판 흐름에서 접수와 AI 분석 결과를 확인합니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/cs"
            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-yellow-300 hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-gray-900 text-white">
              <Factory className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-600">
                산업현장 관리자
              </p>
              <h2 className="text-xl font-bold text-gray-900">관리자 대시보드</h2>
              <p className="text-sm leading-6 text-gray-600">
                AI가 분류한 클레임 유형, 원인 후보, 대응 우선순위를 대시보드에서 바로 확인합니다.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                유형 분석
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                원인 후보
              </span>
              <span className="flex items-center gap-1">
                <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
                우선순위
              </span>
            </div>
          </Link>

          <Link
            href="/claims"
            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-yellow-300 hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-yellow-400 text-gray-950">
              <MessageSquareText className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-600">
                클레임 요청자
              </p>
              <h2 className="text-xl font-bold text-gray-900">클레임 게시판</h2>
              <p className="text-sm leading-6 text-gray-600">
                클레임을 작성하면 AI가 원인 분석과 해야 할 일을 정리해 상세 화면에서 보여줍니다.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
              <span>접수, 목록, 상세 분석 화면 유지</span>
              <span className="font-semibold text-gray-800">바로가기</span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
