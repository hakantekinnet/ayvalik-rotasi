import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "Ayvalık Rotası";
  const imageUrl =
    searchParams.get("imageUrl") ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";

  // Build absolute logo URL from the request origin
  const origin = req.nextUrl.origin;
  const logoUrl = `${origin}/logo.PNG`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
          backgroundColor: "#0a0a0a",
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

        {/* Heavy gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: "1920px",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.95) 100%)",
          }}
        />

        {/* Top: Site logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "90px",
            left: "0",
            width: "1080px",
            zIndex: 10,
          }}
        >
          <img
            src={logoUrl}
            alt="Ayvalık Rotası"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Center: Main title — massive, bold, centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "0",
            left: "0",
            width: "1080px",
            height: "1400px",
            zIndex: 10,
            padding: "0 72px",
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              display: "flex",
              width: "80px",
              height: "6px",
              borderRadius: "3px",
              background: "linear-gradient(90deg, #22D3EE 0%, #0891B2 100%)",
              marginBottom: "32px",
            }}
          />

          {/* Label */}
          <span
            style={{
              display: "flex",
              fontSize: "26px",
              fontWeight: 700,
              color: "#22D3EE",
              textTransform: "uppercase",
              letterSpacing: "8px",
              marginBottom: "28px",
            }}
          >
            SON DAKİKA
          </span>

          {/* Title */}
          <span
            style={{
              fontSize: "90px",
              fontWeight: 900,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.08,
              textShadow:
                "0 2px 20px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.5)",
              maxWidth: "940px",
              letterSpacing: "-2px",
            }}
          >
            {title}
          </span>
        </div>

        {/* Bottom: Link sticker zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            bottom: "180px",
            left: "0",
            width: "1080px",
            zIndex: 10,
            gap: "20px",
          }}
        >
          {/* Hint text above the frame */}
          <span
            style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "1px",
            }}
          >
            Haberin devamı için dokun 👇
          </span>

          {/* Empty sticker placeholder frame */}
          <div
            style={{
              display: "flex",
              width: "350px",
              height: "100px",
              borderRadius: "24px",
              background: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 0 40px rgba(34,211,238,0.08)",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}
