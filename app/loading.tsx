import { LoadingIndicator } from "@/components/loading-indicator"

export default function Loading() {
  return (
    <main className="flex min-h-[calc(100dvh-6rem)] items-center justify-center bg-[#fffaf6] px-6 py-24">
      <div className="rounded-[2rem] border border-[#e5ddd4] bg-white px-6 py-5 shadow-sm">
        <LoadingIndicator
          label="Loading the store..."
          className="text-[#4b3a2e]"
        />
      </div>
    </main>
  )
}
