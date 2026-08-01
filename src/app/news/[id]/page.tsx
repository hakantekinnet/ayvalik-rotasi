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
          href="/feed"
          className="absolute top-6 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={16} />
          Haberlere Dön
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

        {/* WhatsApp Share */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              "📢 " +
                article.title +
                "\n\nHaberi okumak için tıkla:\nhttps://ayvalik-rotasi.vercel.app/news/" +
                id
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#25D366]/25 hover:scale-[1.02] active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp&apos;ta Paylaş
          </a>
        </div>

        {/* Back CTA */}
        <div className="mt-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-full font-semibold text-sm shadow-lg hover:bg-[#0d6b63] transition-colors active:scale-95"
          >
            <ArrowLeft size={16} />
            Haberlere Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
