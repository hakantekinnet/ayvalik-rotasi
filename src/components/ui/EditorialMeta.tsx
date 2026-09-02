import {
  Lightbulb,
  AlertTriangle,
  Link as LinkIcon,
  CalendarCheck,
  CheckCircle,
  Camera,
} from "lucide-react";

interface EditorialMetaProps {
  editorNote?: string;
  expiresAt?: string;
  sourceName?: string;
  sourceUrl?: string;
  originalPublishedAt?: string;
  verifiedAt?: string;
  imageCredit?: string;
  /** Label for expired banner, e.g. "Bu etkinlik" or "Bu duyuru" */
  expiredLabel?: string;
}

function formatDateTr(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isExpired(dateStr: string): boolean {
  try {
    return new Date(dateStr) < new Date();
  } catch {
    return false;
  }
}

/**
 * Reusable editorial metadata components for News & Event detail pages.
 * Renders: Expired banner, Editor's Note callout, Source/Credits footer.
 */
export function EditorialMeta({
  editorNote,
  expiresAt,
  sourceName,
  sourceUrl,
  originalPublishedAt,
  verifiedAt,
  imageCredit,
  expiredLabel = "Bu içerik",
}: EditorialMetaProps) {
  const expired = expiresAt ? isExpired(expiresAt) : false;
  const hasSourceFooter =
    sourceName || originalPublishedAt || verifiedAt || imageCredit;

  return (
    <>
      {/* ── Expired Banner ── */}
      {expired && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 mb-6">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-red-700">
            {expiredLabel} sona ermiştir.
          </p>
        </div>
      )}

      {/* ── Editor's Note Callout ── */}
      {editorNote && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-amber-600" />
            <h3 className="text-sm font-bold text-amber-800">
              Ayvalık Rotası Notu
            </h3>
          </div>
          <p className="text-sm text-amber-900/80 leading-relaxed">
            {editorNote}
          </p>
        </div>
      )}

      {/* ── Source & Credits Footer ── */}
      {hasSourceFooter && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 mt-8 overflow-hidden">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Kaynak & Telif Bilgileri
          </h3>
          <div className="space-y-2.5 min-w-0">
            {sourceName && (
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <LinkIcon size={14} className="text-aegean-500 flex-shrink-0" />
                <span className="min-w-0">
                  <span className="font-medium text-slate-500">Kaynak: </span>
                  {sourceUrl ? (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-aegean-600 hover:text-aegean-700 underline decoration-aegean-300 underline-offset-2 transition-colors break-all"
                    >
                      {sourceName} →
                    </a>
                  ) : (
                    <span className="font-semibold break-words">{sourceName}</span>
                  )}
                </span>
              </div>
            )}
            {originalPublishedAt && (
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <CalendarCheck
                  size={14}
                  className="text-blue-500 flex-shrink-0"
                />
                <span className="min-w-0 break-words">
                  <span className="font-medium text-slate-500">
                    Orijinal Yayın:{" "}
                  </span>
                  <span className="font-semibold">
                    {formatDateTr(originalPublishedAt)}
                  </span>
                </span>
              </div>
            )}
            {verifiedAt && (
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle
                  size={14}
                  className="text-green-500 flex-shrink-0"
                />
                <span className="min-w-0 break-words">
                  <span className="font-medium text-slate-500">
                    Son Doğrulama:{" "}
                  </span>
                  <span className="font-semibold">
                    {formatDateTr(verifiedAt)}
                  </span>
                </span>
              </div>
            )}
            {imageCredit && (
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Camera size={14} className="text-purple-500 flex-shrink-0" />
                <span className="min-w-0 break-words">
                  <span className="font-medium text-slate-500">
                    Görsel Kaynağı:{" "}
                  </span>
                  <span className="font-semibold">{imageCredit}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
