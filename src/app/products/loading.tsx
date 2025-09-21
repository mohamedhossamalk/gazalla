import Header from '@/components/Header';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading products...</p>
        </div>
      </main>
    </div>
  );
}