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

        {/* Heavy gradient overlay — dark from bottom, medium everywhere else */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: "1920px",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 25%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.88) 75%, rgba(0,0,0,0.95) 100%)",
          }}
        />

        {/* Top: Brand badge — frosted glass pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            position: "absolute",
            top: "100px",
            left: "72px",
            zIndex: 10,
            padding: "18px 40px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span style={{ fontSize: "32px" }}>📍</span>
          <span
            style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.3px",
            }}
          >
            AYVALIK ROTASI
          </span>
        </div>

        {/* Center-left: Main title block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: "1320px",
            zIndex: 10,
            padding: "0 72px 40px 72px",
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              display: "flex",
              width: "80px",
              height: "6px",
              borderRadius: "3px",
              background:
                "linear-gradient(90deg, #22D3EE 0%, #0891B2 100%)",
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
              marginBottom: "24px",
            }}
          >
            SON DAKİKA
          </span>

          {/* Title — massive, left-aligned */}
          <span
            style={{
              fontSize: "90px",
              fontWeight: 900,
              color: "#FFFFFF",
              textAlign: "left",
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

        {/* Bottom: Premium link sticker zone */}
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
            gap: "24px",
          }}
        >
          {/* Frosted glass link box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 72px",
              borderRadius: "28px",
              background: "rgba(255,255,255,0.1)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              boxShadow:
                "0 0 60px rgba(34,211,238,0.15), 0 8px 32px rgba(0,0,0,0.3)",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "34px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "3px",
              }}
            >
              HABERİ OKUMAK İÇİN TIKLA
            </span>
            <span
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              ayvalikrotasi.com
            </span>
          </div>

          {/* Subtle placement hint */}
          <span
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 600,
              letterSpacing: "4px",
            }}
          >
            👆 LINK STİCKER ALANI 👆
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
