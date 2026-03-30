// Print-ready PDF generation using @react-pdf/renderer
// Page size: 210x210mm square (standard children's book)
// Embed AI-generated illustrations as base64 images

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  pdf,
  type DocumentProps,
} from "@react-pdf/renderer";
import React, { type ReactElement } from "react";

interface BookPage {
  pageNumber: number;
  textContent: string;
  gradient?: string;
  imageUrl?: string;
}

interface BookPdfProps {
  storyTitle: string;
  childName: string;
  pages: BookPage[];
}

// 210x210mm square book — 595.28pt wide, 595.28pt tall (210mm in PDF points at 72dpi)
const PAGE_SIZE = { width: 595.28, height: 595.28 };
const BLEED = 8; // 8pt bleed on each side (~3mm)

const styles = StyleSheet.create({
  // ── Cover ────────────────────────────────────────────────────
  cover: {
    width: PAGE_SIZE.width,
    height: PAGE_SIZE.height,
    backgroundColor: "#ff723b",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  coverBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  coverBadgeText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  coverDecoration: {
    width: 80,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 2,
    marginBottom: 24,
  },
  coverTitle: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 1.25,
    marginBottom: 16,
  },
  coverSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
  },
  coverFooter: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  coverFooterText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 8,
    letterSpacing: 2,
  },
  coverSpine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 18,
    backgroundColor: "rgba(0,0,0,0.12)",
  },

  // ── Story pages ──────────────────────────────────────────────
  page: {
    width: PAGE_SIZE.width,
    height: PAGE_SIZE.height,
    backgroundColor: "#fdf8f3",
    flexDirection: "column",
  },
  illustrationArea: {
    width: PAGE_SIZE.width,
    height: PAGE_SIZE.height * 0.72,
    backgroundColor: "#ebe1d3",
    overflow: "hidden",
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  illustrationFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0d4c0",
  },
  illustrationFallbackText: {
    color: "#9b8e82",
    fontSize: 9,
  },
  textArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 36,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0e8dc",
    justifyContent: "center",
    alignItems: "center",
  },
  storyText: {
    color: "#2d1a0e",
    fontSize: 16,
    lineHeight: 1.65,
    textAlign: "center",
    fontStyle: "italic",
    maxWidth: 440,
  },
  pageNumberBadge: {
    position: "absolute",
    bottom: 10,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.07)",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  pageNumberText: {
    color: "#9b8e82",
    fontSize: 7,
  },

  // ── Back cover ───────────────────────────────────────────────
  backCover: {
    width: PAGE_SIZE.width,
    height: PAGE_SIZE.height,
    backgroundColor: "#1a0c06",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  backLogo: {
    color: "#ff723b",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 8,
  },
  backTagline: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 1.7,
    marginBottom: 32,
  },
  backDivider: {
    width: 40,
    height: 2,
    backgroundColor: "#ff723b",
    borderRadius: 1,
    marginBottom: 32,
  },
  backUrl: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 9,
    letterSpacing: 1,
  },
  backMade: {
    position: "absolute",
    bottom: 24,
    color: "rgba(255,255,255,0.2)",
    fontSize: 7,
    letterSpacing: 1,
  },
});

function CoverPage({ title, childName }: { title: string; childName: string }) {
  return (
    <Page size={[PAGE_SIZE.width, PAGE_SIZE.height]} style={styles.cover}>
      <View style={styles.coverSpine} />
      <View style={styles.coverBadge}>
        <Text style={styles.coverBadgeText}>HEROBOOK · БЪЛГАРИЯ</Text>
      </View>
      <View style={styles.coverDecoration} />
      <Text style={styles.coverTitle}>{title}</Text>
      <Text style={styles.coverSubtitle}>Историята на {childName}</Text>
      <View style={styles.coverFooter}>
        <Text style={styles.coverFooterText}>herobook.bg</Text>
      </View>
    </Page>
  );
}

function StoryPage({ page }: { page: BookPage }) {
  const hasImage =
    page.imageUrl &&
    (page.imageUrl.startsWith("http") || page.imageUrl.startsWith("data:"));

  return (
    <Page size={[PAGE_SIZE.width, PAGE_SIZE.height]} style={styles.page}>
      {/* Illustration — 72% of page height */}
      <View style={styles.illustrationArea}>
        {hasImage ? (
          <Image src={page.imageUrl!} style={styles.illustrationImage} />
        ) : (
          <View style={styles.illustrationFallback}>
            <Text style={styles.illustrationFallbackText}>
              Страница {page.pageNumber}
            </Text>
          </View>
        )}
      </View>

      {/* Story text — bottom 28% */}
      <View style={styles.textArea}>
        <Text style={styles.storyText}>{page.textContent}</Text>
      </View>

      {/* Page number */}
      <View style={styles.pageNumberBadge}>
        <Text style={styles.pageNumberText}>{page.pageNumber}</Text>
      </View>
    </Page>
  );
}

function BackCover() {
  return (
    <Page size={[PAGE_SIZE.width, PAGE_SIZE.height]} style={styles.backCover}>
      <Text style={styles.backLogo}>HeroBook</Text>
      <Text style={styles.backTagline}>
        Персонализирани детски книжки{"\n"}
        с лицето на вашето дете{"\n"}
        Произведено с любов в България
      </Text>
      <View style={styles.backDivider} />
      <Text style={styles.backUrl}>herobook.bg</Text>
      <Text style={styles.backMade}>ПРОИЗВЕДЕНО В БЪЛГАРИЯ © 2026</Text>
    </Page>
  );
}

function BookDocument({ storyTitle, childName, pages }: BookPdfProps) {
  return (
    <Document
      title={storyTitle}
      author="HeroBook"
      subject={`Персонализирана книжка за ${childName}`}
      creator="HeroBook · herobook.bg"
      producer="HeroBook"
    >
      <CoverPage title={storyTitle} childName={childName} />
      {pages.map((page) => (
        <StoryPage key={page.pageNumber} page={page} />
      ))}
      <BackCover />
    </Document>
  );
}

export async function generateBookPdf(props: BookPdfProps): Promise<Buffer> {
  const element = React.createElement(
    BookDocument,
    props
  ) as ReactElement<DocumentProps>;
  const instance = pdf(element);
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
