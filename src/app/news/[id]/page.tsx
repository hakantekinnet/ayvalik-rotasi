import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;

  const { data: article, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <span className="text-6xl mb-6 block">📰</span>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            Haber bulunamadı
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Aradığınız haber silinmiş veya taşınmış olabilir.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-[#0d6b63] transition-colors"
          >
            <ArrowLeft size={16} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString(
    "tr-TR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const imageUrl =
    article.image ||
    article.image_url ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image */}
      <div className="relative w-full h-72 overflow-hidden">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={16} />
          Geri Dön
        </Link>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-white text-2xl font-extrabold leading-tight mb-2">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-white/70">
            <Calendar size={14} />
            <span className="text-xs font-medium">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-5 py-8 max-w-2xl mx-auto">
        {/* Summary / Description */}
        {(article.description || article.summary) && (
          <p className="text-base font-semibold text-gray-700 leading-relaxed mb-6 border-l-4 border-[#0F766E] pl-4">
            {article.description || article.summary}
          </p>
        )}

        {/* Full Content */}
        {article.content && (
          <div className="prose prose-sm prose-gray max-w-none">
            {article.content.split("\n").map((paragraph: string, i: number) => (
              <p
                key={i}
                className="text-gray-600 text-sm leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Back CTA */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-[#0d6b63] transition-colors active:scale-95"
          >
            <ArrowLeft size={16} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
