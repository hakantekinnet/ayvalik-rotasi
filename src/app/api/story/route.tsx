import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "Ayvalık Rotası";
  const summary = searchParams.get("summary") || "";
  const imageUrl =
    searchParams.get("imageUrl") ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";

  const origin = req.nextUrl.origin;
  const logoUrl = `${origin}/logo.PNG`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
          backgroundColor: "#022B3A",
        }}
      >
        {/* Background image — fills entire frame */}
        <img
          src={imageUrl}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: "1920px",
            objectFit: "cover",
          }}
        />

        {/* Gradient overlay — deep blue-to-teal, bottom-heavy */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: "1920px",
            display: "flex",
            background:
              "linear-gradient(to top, #022B3A 0%, rgba(2,43,58,0.95) 20%, rgba(31,122,140,0.75) 50%, rgba(31,122,140,0.3) 75%, transparent 100%)",
          }}
        />

        {/* Top: Centered logo — large */}
        <div
          style={{
            display: "flex",
            width: "1080px",
            justifyContent: "center",
            position: "absolute",
            top: "64px",
            left: "0",
            zIndex: 10,
            padding: "0 48px",
          }}
        >
          <img
            src={logoUrl}
            alt="Ayvalık Rotası"
            style={{
              width: "400px",
              height: "400px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Content container — bottom-aligned */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "1080px",
            height: "1920px",
            position: "relative",
            zIndex: 10,
            padding: "48px 72px 80px 72px",
          }}
        >
          {/* Title — massive, ultra-bold */}
          <span
            style={{
              fontSize: "80px",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              textShadow:
                "0 4px 24px rgba(2,43,58,0.6), 0 2px 8px rgba(0,0,0,0.4)",
              maxWidth: "940px",
            }}
          >
            {title}
          </span>

          {/* Summary — below title */}
          {summary && (
            <span
              style={{
                display: "flex",
                fontSize: "36px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.4,
                marginTop: "24px",
                maxWidth: "900px",
              }}
            >
              {summary}
            </span>
          )}

          {/* Spacer before sticker zone */}
          <div style={{ display: "flex", marginTop: "48px" }} />

          {/* Link sticker guide text */}
          <span
            style={{
              fontSize: "30px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              marginBottom: "16px",
            }}
          >
            Haberin detayları için dokun 👇
          </span>

          {/* Link sticker empty frame */}
          <div
            style={{
              display: "flex",
              width: "450px",
              height: "130px",
              borderRadius: "32px",
              background: "rgba(255,255,255,0.1)",
              border: "4px solid rgba(255,255,255,0.4)",
              marginBottom: "48px",
            }}
          />

          {/* Footer domain */}
          <span
            style={{
              fontSize: "28px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "1px",
            }}
          >
            www.ayvalikrotasi.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}
