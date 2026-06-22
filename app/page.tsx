import { QueryProvider } from "@/components/QueryProvider";
import { ReviewDashboard } from "@/features/reviews/componenets/ReviewDashboard";


export default function Home() {
  return (
    <QueryProvider>
      <main className="min-h-screen bg-gray-50 py-8">
        <ReviewDashboard initialReviews={[]} />
      </main>
    </QueryProvider>
  );
}