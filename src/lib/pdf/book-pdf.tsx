// Print-ready PDF generation using @react-pdf/renderer
// Layout: Cover → (IllustrationPage + TextPage) × N → BackCover
// Matches childbook.ai style: full-bleed illustrations, clean separate text pages
// Page size: 210×297mm (A4 portrait — standard children's book)
// Font: Nunito — rounded, child-friendly, full Cyrillic support

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
  pdf,
  type DocumentProps,
} from "@react-pdf/renderer";
import React, { type ReactElement } from "react";
import path from "path";

// ─── Font registration ────────────────────────────────────────────────────────

const FONT_DIR = path.join(process.cwd(), "public/fonts");

Font.register({
  family: "Nunito",
  fonts: [
    { src: path.join(FONT_DIR, "nunito-400.ttf"),        fontWeight: 400, fontStyle: "normal" },
    { src: path.join(FONT_DIR, "nunito-400-italic.ttf"), fontWeight: 400, fontStyle: "italic" },
    { src: path.join(FONT_DIR, "nunito-700.ttf"),        fontWeight: 700, fontStyle: "normal" },
    { src: path.join(FONT_DIR, "nunito-800.ttf"),        fontWeight: 800, fontStyle: "normal" },
    { src: path.join(FONT_DIR, "nunito-900.ttf"),        fontWeight: 900, fontStyle: "normal" },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookPage {
  pageNumber: number;
  textContent: string;
  imageUrl?: string;
}

export interface BookPdfProps {
  storyTitle: string;
  childName: string;
  pages: BookPage[];
  storySlug?: string;
}

// ─── Dimensions — A4 portrait ─────────────────────────────────────────────────
// 595.28 × 841.89 pt

const W = 595.28;
const H = 841.89;

// ─── Colours ──────────────────────────────────────────────────────────────────

const C = {
  orange:      "#FF6B35",
  orangeDark:  "#E55A25",
  gold:        "#F5C842",
  goldLight:   "#FDE88A",
  cream:       "#FDF6EC",
  warmWhite:   "#FFFBF5",
  offWhite:    "#F8F4EF",
  brown:       "#2D1A0E",
  brownMid:    "#5C3D2E",
  brownLight:  "#9B7B6B",
  parchment:   "#F2E8D9",
  borderLight: "#E8DDD0",
  coverBg:     "#1A1035",  // deep night-sky purple — feels premium
  backBg:      "#1A0C06",
  starYellow:  "#FFD700",
  accentPurple:"#6B4FA0",
  accentBlue:  "#3B7DD8",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // ── Cover ────────────────────────────────────────────────────────────────────
  coverPage: {
    width: W,
    height: H,
    backgroundColor: C.coverBg,
    position: "relative",
    overflow: "hidden",
    flexDirection: "column",
  },

  // Full-bleed illustration fills top ~72% of cover
  coverImageZone: {
    width: W,
    height: H * 0.72,
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverImagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A1E55",
  },
  coverPlaceholderText: {
    fontFamily: "Nunito",
    fontWeight: 700,
    fontSize: 52,
    color: "rgba(255,255,255,0.15)",
    textAlign: "center",
  },

  // Gradient-style overlay at bottom of image for text bleed
  coverImageFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: C.coverBg,
    opacity: 0.65,
  },

  // Title band — bottom 28%
  coverTextBand: {
    flex: 1,
    backgroundColor: C.coverBg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 24,
    paddingTop: 8,
  },
  coverBrandPill: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    marginBottom: 14,
  },
  coverBrandText: {
    fontFamily: "Nunito",
    fontWeight: 800,
    fontSize: 9,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 3,
  },
  coverDivider: {
    width: 40,
    height: 2,
    backgroundColor: C.gold,
    borderRadius: 1,
    marginBottom: 12,
  },
  coverTitle: {
    fontFamily: "Nunito",
    fontWeight: 900,
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 1.25,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontFamily: "Nunito",
    fontWeight: 700,
    fontSize: 15,
    color: C.goldLight,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 16,
  },
  coverStarsRow: {
    flexDirection: "row",
    gap: 5,
  },
  coverStar: {
    fontFamily: "Nunito",
    fontSize: 12,
    color: C.gold,
  },
  coverFooter: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  coverFooterText: {
    fontFamily: "Nunito",
    fontWeight: 400,
    fontSize: 8,
    color: "rgba(255,255,255,0.30)",
    letterSpacing: 2,
  },

  // ── Illustration page (full-bleed) ───────────────────────────────────────────
  illustrationPage: {
    width: W,
    height: H,
    backgroundColor: C.parchment,
    position: "relative",
    overflow: "hidden",
  },
  fullBleedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  // Page number pill bottom-right
  imagePageNum: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imagePageNumText: {
    fontFamily: "Nunito",
    fontWeight: 700,
    fontSize: 9,
    color: "rgba(255,255,255,0.75)",
  },
  // Placeholder when no image
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.parchment,
    flexDirection: "column",
  },
  imagePlaceholderEmoji: {
    fontSize: 80,
    color: "rgba(180,140,100,0.35)",
    marginBottom: 12,
  },
  imagePlaceholderLabel: {
    fontFamily: "Nunito",
    fontWeight: 700,
    fontSize: 13,
    color: "rgba(140,110,80,0.4)",
    letterSpacing: 1,
  },

  // ── Text page ────────────────────────────────────────────────────────────────
  textPage: {
    width: W,
    height: H,
    backgroundColor: C.warmWhite,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48,
    paddingVertical: 56,
    position: "relative",
  },
  textPageTopDecor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: C.orange,
    opacity: 0.6,
  },
  textPageBottomDecor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: C.orange,
    opacity: 0.6,
  },
  textPageDividerTop: {
    width: 36,
    height: 2,
    backgroundColor: C.borderLight,
    borderRadius: 1,
    marginBottom: 32,
  },
  storyText: {
    fontFamily: "Nunito",
    fontWeight: 700,
    fontSize: 28,
    color: C.brown,
    lineHeight: 1.75,
    textAlign: "center",
  },
  textPageDividerBottom: {
    width: 36,
    height: 2,
    backgroundColor: C.borderLight,
    borderRadius: 1,
    marginTop: 32,
  },
  // Page number badge bottom-centre
  textPageNum: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  textPageNumText: {
    fontFamily: "Nunito",
    fontWeight: 700,
    fontSize: 10,
    color: C.brownLight,
  },
  // Small brand watermark bottom-left
  textPageBrand: {
    position: "absolute",
    bottom: 22,
    left: 28,
  },
  textPageBrandText: {
    fontFamily: "Nunito",
    fontWeight: 400,
    fontSize: 8,
    color: "rgba(180,140,100,0.35)",
    letterSpacing: 1.5,
  },

  // ── Back cover ───────────────────────────────────────────────────────────────
  backPage: {
    width: W,
    height: H,
    backgroundColor: C.backBg,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
    position: "relative",
  },
  backTopAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: C.orange,
  },
  backLogoText: {
    fontFamily: "Nunito",
    fontWeight: 900,
    fontSize: 40,
    color: C.orange,
    letterSpacing: 2,
    marginBottom: 4,
  },
  backLogoSub: {
    fontFamily: "Nunito",
    fontWeight: 400,
    fontSize: 10,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 3,
    marginBottom: 32,
  },
  backDivider: {
    width: 48,
    height: 2,
    backgroundColor: C.orange,
    borderRadius: 1,
    marginBottom: 32,
  },
  backStars: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 28,
  },
  backStarChar: {
    fontSize: 18,
    color: C.starYellow,
  },
  backTagline: {
    fontFamily: "Nunito",
    fontWeight: 700,
    fontSize: 15,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 1.9,
    marginBottom: 36,
    maxWidth: 360,
  },
  backUrl: {
    fontFamily: "Nunito",
    fontWeight: 800,
    fontSize: 13,
    color: C.orange,
    letterSpacing: 2,
  },
  backFooter: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  backFooterText: {
    fontFamily: "Nunito",
    fontWeight: 400,
    fontSize: 8,
    color: "rgba(255,255,255,0.18)",
    letterSpacing: 1.5,
  },
});

// ─── Story-specific placeholder emojis ───────────────────────────────────────

const STORY_EMOJI: Record<string, string> = {
  "kosmichesko-priklyuchenie":    "🚀",
  "printsesata-ot-izgreva":       "👑",
  "supergerojski-den":            "⚡",
  "v-dzhunglata-na-priyatelite":  "🌿",
  "malkiyat-gotvach":             "🍳",
  "piratite-na-cherno-more":      "🏴",
  "feyata-na-gorite":             "🧚",
  "dinozavarat-priyatel":         "🦕",
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function isRealUrl(url?: string): boolean {
  return !!url &&
    (url.startsWith("http") || url.startsWith("data:")) &&
    !url.startsWith("mock:");
}

// ─── Components ───────────────────────────────────────────────────────────────

function CoverPage({
  title,
  childName,
  coverImageUrl,
}: {
  title: string;
  childName: string;
  coverImageUrl?: string;
}) {
  return (
    <Page size={[W, H]} style={styles.coverPage}>
      {/* Full-bleed illustration zone */}
      <View style={styles.coverImageZone}>
        {isRealUrl(coverImageUrl) ? (
          <Image src={coverImageUrl!} style={styles.coverImage} />
        ) : (
          <View style={styles.coverImagePlaceholder}>
            <Text style={styles.coverPlaceholderText}>✦</Text>
          </View>
        )}
        <View style={styles.coverImageFade} />
      </View>

      {/* Title band */}
      <View style={styles.coverTextBand}>
        <View style={styles.coverBrandPill}>
          <Text style={styles.coverBrandText}>HEROBOOK · БЪЛГАРИЯ</Text>
        </View>
        <View style={styles.coverDivider} />
        <Text style={styles.coverTitle}>{title}</Text>
        <Text style={styles.coverSubtitle}>Историята на {childName}</Text>
        <View style={styles.coverStarsRow}>
          {["★", "★", "★", "★", "★"].map((s, i) => (
            <Text key={i} style={styles.coverStar}>{s}</Text>
          ))}
        </View>
      </View>

      <View style={styles.coverFooter}>
        <Text style={styles.coverFooterText}>herobook.bg</Text>
      </View>
    </Page>
  );
}

// Full-bleed illustration page
function IllustrationPage({
  page,
  spreadNumber,
  storySlug,
}: {
  page: BookPage;
  spreadNumber: number;
  storySlug?: string;
}) {
  const emoji = STORY_EMOJI[storySlug ?? ""] ?? "✨";

  return (
    <Page size={[W, H]} style={styles.illustrationPage}>
      {isRealUrl(page.imageUrl) ? (
        <Image src={page.imageUrl!} style={styles.fullBleedImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderEmoji}>{emoji}</Text>
          <Text style={styles.imagePlaceholderLabel}>Илюстрация {spreadNumber}</Text>
        </View>
      )}
      <View style={styles.imagePageNum}>
        <Text style={styles.imagePageNumText}>{spreadNumber * 2 - 1}</Text>
      </View>
    </Page>
  );
}

// Clean white text page
function TextPage({
  page,
  spreadNumber,
}: {
  page: BookPage;
  spreadNumber: number;
}) {
  return (
    <Page size={[W, H]} style={styles.textPage}>
      <View style={styles.textPageTopDecor} />
      <View style={styles.textPageBottomDecor} />

      <View style={styles.textPageDividerTop} />
      <Text style={styles.storyText}>{page.textContent}</Text>
      <View style={styles.textPageDividerBottom} />

      <View style={styles.textPageNum}>
        <Text style={styles.textPageNumText}>{spreadNumber * 2}</Text>
      </View>

      <View style={styles.textPageBrand}>
        <Text style={styles.textPageBrandText}>herobook.bg</Text>
      </View>
    </Page>
  );
}

function BackCover() {
  return (
    <Page size={[W, H]} style={styles.backPage}>
      <View style={styles.backTopAccent} />
      <Text style={styles.backLogoText}>HeroBook</Text>
      <Text style={styles.backLogoSub}>ПЕРСОНАЛИЗИРАНИ ДЕТСКИ КНИЖКИ</Text>
      <View style={styles.backDivider} />
      <View style={styles.backStars}>
        {["★", "★", "★", "★", "★"].map((s, i) => (
          <Text key={i} style={styles.backStarChar}>{s}</Text>
        ))}
      </View>
      <Text style={styles.backTagline}>
        {"Поставяме лицето на вашето дете\nв приказните илюстрации с AI.\nПроизведено с любов в България."}
      </Text>
      <Text style={styles.backUrl}>herobook.bg</Text>
      <View style={styles.backFooter}>
        <Text style={styles.backFooterText}>ПРОИЗВЕДЕНО В БЪЛГАРИЯ  ©  2026</Text>
      </View>
    </Page>
  );
}

function BookDocument({ storyTitle, childName, pages, storySlug }: BookPdfProps) {
  // Use the first page with a real image as the cover illustration
  const coverImage = pages.find((p) => isRealUrl(p.imageUrl))?.imageUrl;

  return (
    <Document
      title={storyTitle}
      author="HeroBook"
      subject={`Персонализирана книжка за ${childName}`}
      creator="HeroBook · herobook.bg"
      producer="HeroBook"
    >
      <CoverPage title={storyTitle} childName={childName} coverImageUrl={coverImage} />

      {pages.map((page, idx) => (
        // Each story page renders as TWO PDF pages: full-bleed illustration + text page
        <React.Fragment key={page.pageNumber}>
          <IllustrationPage page={page} spreadNumber={idx + 1} storySlug={storySlug} />
          <TextPage page={page} spreadNumber={idx + 1} />
        </React.Fragment>
      ))}

      <BackCover />
    </Document>
  );
}

export async function generateBookPdf(props: BookPdfProps): Promise<Buffer> {
  const element = React.createElement(BookDocument, props) as ReactElement<DocumentProps>;
  const instance = pdf(element);
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
