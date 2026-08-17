import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "TinyClick - Free Fast URL Shortener with Custom Links & Analytics";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px 70px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient background glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-100px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
          }}
        />

        {/* Top bar: Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "54px",
              height: "54px",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              color: "#09090b",
              fontWeight: 800,
              fontSize: "28px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
            }}
          >
            🔗
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
            }}
          >
            TinyClick
          </span>
          <div
            style={{
              marginLeft: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "9999px",
              padding: "6px 14px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#60a5fa",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            100% Free & Fast
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "950px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "#ffffff",
            }}
          >
            Transform Long Links into Fast, Clean & Trackable URLs.
          </h1>
          <p
            style={{
              fontSize: "24px",
              lineHeight: 1.4,
              color: "#a1a1aa",
              margin: 0,
            }}
          >
            Shorten URLs instantly with custom aliases, real-time analytics, editable destinations, and link expiration.
          </p>
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              padding: "10px 18px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#e4e4e7",
            }}
          >
            ⚡ Sub-Millisecond Redirects
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              padding: "10px 18px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#e4e4e7",
            }}
          >
            🎯 Custom Link Aliases
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              padding: "10px 18px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#e4e4e7",
            }}
          >
            📊 Real-Time Click Analytics
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              padding: "10px 18px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#e4e4e7",
            }}
          >
            🔒 Privacy First & No Ads
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
