import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "Ayvalık Rotası";
  const imageUrl =
    searchParams.get("imageUrl") ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
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

        {/* Dark gradient overlay — heavier at top and bottom for text readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: "1920px",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* Top: Brand badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "120px",
            zIndex: 10,
            padding: "16px 36px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <span style={{ fontSize: "36px" }}>📍</span>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.5px",
            }}
          >
            Ayvalık Rotası
          </span>
        </div>

        {/* Center: Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            padding: "0 72px",
            marginTop: "-100px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
              letterSpacing: "6px",
              marginBottom: "28px",
            }}
          >
            SON DAKİKA
          </span>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: "0 4px 30px rgba(0,0,0,0.6)",
              maxWidth: "900px",
            }}
          >
            {title}
          </span>
        </div>

        {/* Bottom: Link Sticker Zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
            marginBottom: "200px",
            gap: "20px",
          }}
        >
          {/* Link sticker bounding box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "28px 64px",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, rgba(14,116,144,0.85) 0%, rgba(8,145,178,0.85) 100%)",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "1px",
              }}
            >
              HABERİ OKU
            </span>
            <span
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: 600,
              }}
            >
              ayvalikrotasi.com
            </span>
          </div>

          {/* Arrow hint */}
          <span
            style={{
              fontSize: "32px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            👆 LINK STİCKER BURAYA 👆
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
