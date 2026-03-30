// Server-side PDF generation using @react-pdf/renderer
// Generates a full children's book PDF from story pages

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  pdf,
  type DocumentProps,
} from "@react-pdf/renderer";
import React, { type ReactElement } from "react";

// Register a safe fallback font (built-in)
// In production, register Nunito from Google Fonts for brand consistency

interface BookPage {
  pageNumber: number;
  textContent: string;
  gradient: string; // CSS class — not used in PDF, but kept for reference
  imageUrl?: string; // Supabase storage URL for the generated illustration
}

interface BookPdfProps {
  storyTitle: string;
  childName: string;
  pages: BookPage[];
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f4ece0",
    flexDirection: "column",
  },
  coverPage: {
    backgroundColor: "#ff723b",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  coverBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  coverBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  coverTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 1.3,
    marginBottom: 16,
  },
  coverSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    textAlign: "center",
  },
  coverFooter: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  coverFooterText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 9,
    letterSpacing: 1,
  },

  // Story pages
  illustrationArea: {
    flex: 1,
    backgroundColor: "#ebe1d3",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#d4c5b0",
  },
  illustrationText: {
    color: "#6b625e",
    fontSize: 10,
    textAlign: "center",
  },
  textArea: {
    backgroundColor: "#ffffff",
    padding: 20,
    minHeight: 80,
    borderTopWidth: 1,
    borderTopColor: "#e8ddd0",
    justifyContent: "center",
  },
  storyText: {
    color: "#3c3a39",
    fontSize: 13,
    lineHeight: 1.6,
    textAlign: "center",
    fontStyle: "italic",
  },
  pageNumber: {
    position: "absolute",
    bottom: 8,
    right: 14,
    color: "#9ca4ab",
    fontSize: 8,
  },
  backCover: {
    backgroundColor: "#1a0c06",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  backCoverTitle: {
    color: "#ff723b",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  backCoverText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 1.6,
  },
});

function CoverPage({ title, childName }: { title: string; childName: string }) {
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverBadge}>
        <Text style={styles.coverBadgeText}>ПРОИЗВЕДЕНО В БЪЛГАРИЯ</Text>
      </View>
      <Text style={styles.coverTitle}>{title}</Text>
      <Text style={styles.coverSubtitle}>Историята на {childName}</Text>
      <View style={styles.coverFooter}>
        <Text style={styles.coverFooterText}>herobook.bg</Text>
      </View>
    </Page>
  );
}

function StoryPage({ page }: { page: BookPage }) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Illustration area — 70% of page */}
      <View style={[styles.illustrationArea, { height: "70%" }]}>
        <View style={styles.illustrationPlaceholder}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Text style={styles.illustrationText}>
              Илюстрация — Страница {page.pageNumber}
            </Text>
          </View>
        </View>
      </View>

      {/* Text area */}
      <View style={styles.textArea}>
        <Text style={styles.storyText}>{page.textContent}</Text>
      </View>

      <Text style={styles.pageNumber}>{page.pageNumber}</Text>
    </Page>
  );
}

function BackCover() {
  return (
    <Page size="A4" style={styles.backCover}>
      <Text style={styles.backCoverTitle}>HeroBook</Text>
      <Text style={styles.backCoverText}>
        Персонализирани детски книжки{"\n"}
        Произведено с любов в България{"\n\n"}
        herobook.bg
      </Text>
    </Page>
  );
}

function BookDocument({ storyTitle, childName, pages }: BookPdfProps) {
  return (
    <Document
      title={storyTitle}
      author="HeroBook"
      subject={`Персонализирана книжка за ${childName}`}
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
  const element = React.createElement(BookDocument, props) as ReactElement<DocumentProps>;
  const instance = pdf(element);
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
