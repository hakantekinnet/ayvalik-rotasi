import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;

  const article = await client.fetch(
    `*[_type == "news" && _id == $id][0]{
      title,
      summary,
      _createdAt,
      "imageUrl": mainImage.asset->url,
      content
    }`,
    { id }
  );

  if (!article) {
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

  const formattedDate = new Date(article._createdAt).toLocaleDateString(
    "tr-TR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const imageUrl =
    article.imageUrl ||
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
        {/* Summary */}
        {article.summary && (
          <p className="text-base font-semibold text-gray-700 leading-relaxed mb-6 border-l-4 border-[#0F766E] pl-4">
            {article.summary}
          </p>
        )}

        {/* Rich text content */}
        {article.content && (
          <div className="mt-8 text-gray-800 leading-relaxed space-y-4 prose prose-sm prose-gray max-w-none">
            <PortableText value={article.content} />
          </div>
        )}

        {/* Back CTA + Story Download */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-[#0d6b63] transition-colors active:scale-95 w-fit"
          >
            <ArrowLeft size={16} />
            Ana Sayfaya Dön
          </Link>

          <a
            href={`/api/story?title=${encodeURIComponent(article.title)}&imageUrl=${encodeURIComponent(imageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            download="ayvalik-rotasi-story.png"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white rounded-full font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity active:scale-95 w-fit"
          >
            📱 Hikaye Görselini İndir
          </a>
        </div>
      </div>
    </div>
  );
}
