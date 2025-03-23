import { ImageResponse } from "@vercel/og";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

export async function GET() {
  // Make sure the font exists in the specified path:
  const fontPath = path.resolve(
    process.cwd(),
    "src/assets/BalooChettan2-Regular.ttf",
  );
  const boldPath = path.resolve(
    process.cwd(),
    "src/assets/BalooChettan2-Bold.ttf",
  );
  const fontData = await fs
    .readFile(fontPath)
    .then((data) => data.buffer as ArrayBuffer);
  const boldData = await fs
    .readFile(boldPath)
    .then((data) => data.buffer as ArrayBuffer);

  const pokeImg = await sharp(
    path.resolve(process.cwd(), "public/img/pokemon/dragonite.avif"),
  )
    .png()
    .toBuffer()
    .then((buff) => buff.toString("base64"));

  return new ImageResponse(
    (
      <div
        style={{
          background: "hsl(0 0% 91.95%)",
          padding: SCALE * 48,
          paddingTop: SCALE * 64,
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            boxShadow: `${SCALE * 5}px ${SCALE * 5}px 0px 0px black`,
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: SCALE * 18,
            border: `${SCALE * 4}px solid black`,
            position: "relative",
            padding: SCALE * 32,
            flexDirection: "column",
            justifyContent: "flex-end",
            background: "linear-gradient(to left, #f4c489, #ffffff 85%)",
          }}
        >
          <div
            style={{
              transform: "translateY(-50%)",
              boxShadow: `${SCALE * 3}px ${SCALE * 3}px 0px 0px black`,
              border: `${SCALE * 3}px solid black`,
              borderRadius: SCALE * 12,
              position: "absolute",
              top: 0,
              right: SCALE * 32,
              padding: `${SCALE * 6}px ${SCALE * 16}px`,
              fontSize: SCALE * 32,
              zIndex: 1,
              background: "white",
              fontWeight: 900,
            }}
          >
            #149
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: SCALE * 42,
                color: "#312f2f",
                lineHeight: 0,
              }}
            >
              Having fun, building things.
            </div>
            <div
              style={{
                fontSize: SCALE * 84,
                fontWeight: 900,
              }}
            >
              Grant&#39;s Pokémon.
            </div>
          </div>

          <img
            src={`data:image/png;base64,${pokeImg}`}
            style={{
              position: "absolute",
              right: 0,
              bottom: SCALE * 32,
              width: SCALE * 400,
            }}
            alt="not needed"
          />
        </div>
      </div>
    ),
    {
      width: SCALE * 1200,
      height: SCALE * 630,
      fonts: [
        {
          name: "BalooChettan2",
          data: fontData,
          weight: 500,
        },
        {
          name: "BalooChettan2",
          data: boldData,
          weight: 900,
        },
      ],
    },
  );
}

const SCALE = 2;

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ og: "site.png" }];
}
