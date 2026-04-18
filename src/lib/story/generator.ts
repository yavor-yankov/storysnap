/**
 * HeroBook — Personalized Story Generator
 *
 * Priority:
 *   1. Groq (free) — Llama 3.3 70B, fast, ~6,000 req/day free
 *   2. Claude (paid) — best quality, ~$0.05–0.10/book
 *   3. Predefined fallback texts — instant, no API needed
 *
 * Each page returns:
 *   - storyText   : 1–2 sentences in Bulgarian for the printed book
 *   - imagePrompt : detailed English prompt for Flux image generation
 */

import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import type { ChildAttributes, SeedPrompt } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoryPage {
  pageNumber: number;
  storyText: string;      // Bulgarian — printed in the book
  imagePrompt: string;    // English — sent to Flux
}

export interface StoryInput {
  childName: string;
  storySlug: string;
  storyTitle: string;
  pageCount?: number;           // default 24 (5 for preview)
  childAge?: number;            // helps calibrate vocabulary
  childGender?: "boy" | "girl" | "unisex";
  // ── v2 personalisation ──────────────────────────────────
  childAttributes?: ChildAttributes;
  /** Page-by-page beats from the story template — anchors Claude to the story skeleton */
  seedPrompts?: SeedPrompt[];
  /** One randomly-selected twist from story.variation_twists — makes each order unique */
  variationTwist?: string;
}

// ─── Story theme metadata ─────────────────────────────────────────────────────

interface StoryTheme {
  genre: string;
  setting: string;
  palette: string;
  mood: string;
  cast: string;             // supporting characters
  arc: string;              // story arc summary for Claude
}

const STORY_THEMES: Record<string, StoryTheme> = {
  "kosmichesko-priklyuchenie": {
    genre: "space adventure",
    setting: "outer space, colourful nebulas, alien planets, a cosy rocket ship",
    palette: "deep indigo sky, golden stars, bright teal spaceship panels, warm orange accents",
    mood: "wonder, excitement, friendship, discovery",
    cast: "a small friendly green alien named Zorko, a wise talking robot co-pilot",
    arc: "child discovers a rocket, flies to space, befriends an alien, together they discover a new star and name it after the child",
  },
  "printsesata-ot-izgreva": {
    genre: "fairy tale princess",
    setting: "enchanted forest at sunrise, rose-gold kingdom, magical castle towers",
    palette: "warm rose and gold sunrise, soft lavender shadows, emerald green leaves, pearl white",
    mood: "magical, gentle, brave, heartwarming",
    cast: "a wise fox, a gentle bear, a playful deer",
    arc: "child finds a magical crown, is proclaimed Princess of Dawn, sets off to help the enchanted forest and its animal friends",
  },
  "supergerojski-den": {
    genre: "superhero",
    setting: "bright sunny city with skyscrapers, rooftops, blue sky",
    palette: "vivid blue sky, bold primary colours, gleaming golden city buildings, warm sunlight",
    mood: "heroic, energetic, fun, triumphant, kind",
    cast: "a mentor superhero called Solaro, a sidekick robot dog",
    arc: "child wakes up with superpowers, learns kindness is the true superpower, saves the city",
  },
  "v-dzhunglata-na-priyatelite": {
    genre: "jungle adventure",
    setting: "lush tropical jungle, giant waterfall, rainbow, enormous colourful flowers",
    palette: "vibrant emerald and lime greens, tropical orange and pink blooms, warm golden light",
    mood: "playful, adventurous, warm, friendship",
    cast: "a chatty parrot, a gentle elephant, a mischievous monkey",
    arc: "child gets lost in a magical jungle and is guided home by new animal friends",
  },
  "malkiyat-gotvach": {
    genre: "culinary adventure",
    setting: "cosy magical kitchen, huge colourful cakes and pastries, bubbling cauldrons",
    palette: "warm terracotta and cream, colourful sweets, soft golden candlelight",
    mood: "cosy, joyful, creative, delicious",
    cast: "a wise grandma cook, a talking wooden spoon, flying ingredient sprites",
    arc: "child learns to cook magical recipes that bring happiness to the whole village",
  },
  "piratite-na-cherno-more": {
    genre: "pirate adventure",
    setting: "glittering Black Sea, tall-masted pirate ship, hidden coves, treasure islands",
    palette: "deep teal sea, warm orange-and-gold sunset, weathered wood browns, bright white sails",
    mood: "adventurous, dramatic, exciting, funny",
    cast: "friendly pirate captain Rumen, a wise seagull navigator, a treasure-guarding crab",
    arc: "child joins a friendly pirate crew, decodes a treasure map, discovers the real treasure is friendship",
  },
  "feyata-na-gorite": {
    genre: "fairy magic",
    setting: "moonlit enchanted forest, glowing mushroom rings, fireflies, silver streams",
    palette: "moonlit silver, deep forest green, glowing golden fairy light, soft purple twilight",
    mood: "magical, serene, mysterious, enchanting",
    cast: "fairy queen Silvana, tiny glowing sprites, a wise old owl",
    arc: "child helps wounded fairy queen restore the enchanted forest, earns tiny fairy wings",
  },
  "dinozavarat-priyatel": {
    genre: "prehistoric friendship",
    setting: "lush prehistoric valley, giant ferns, tropical blooms, clear blue sky",
    palette: "rich jungle greens, warm earthy browns, bright blue sky, vivid tropical flowers",
    mood: "playful, warm, heartwarming, bittersweet friendship",
    cast: "baby dinosaur Dino, a curious pterodactyl, a helpful triceratops",
    arc: "child finds a dinosaur egg, raises baby Dino, must lovingly take it to its natural home",
  },
};

// ─── Shared Flux style suffix ─────────────────────────────────────────────────
// Appended to EVERY image prompt for visual consistency across all pages.
// IMPORTANT: keep this IDENTICAL on every page — it is the style anchor.

// Style matches childbook.ai: semi-realistic Disney/Pixar digital illustration
// Rich cel-shaded cartoon art, NOT watercolour
const FLUX_STYLE_SUFFIX =
  "beautiful professional children's picture book illustration, " +
  "semi-realistic Disney Pixar CGI art style, rich vibrant cel-shading, " +
  "lush detailed painterly background, soft warm cinematic lighting with dappled sunlight, " +
  "cute cartoon-realistic child character with big expressive eyes and round face, " +
  "smooth clean linework, vivid saturated colours, depth of field bokeh background, " +
  "heartwarming joyful mood, vertical portrait composition, no text, no watermark, " +
  "high quality digital art, " +
  "CONSISTENT ART STYLE: same illustration style, same character design, same colour grading as all other pages in this book";

const FLUX_NEGATIVE =
  "ugly, deformed, blurry, bad anatomy, extra limbs, photorealistic, dark, " +
  "scary, violence, adult content, text, watermark, cropped, grainy, " +
  "flat illustration, minimalist, sketch, pencil drawing";

// ─── Character anchor — injected into every image prompt ─────────────────────
// Provides Flux with a fixed visual description of the child so the character
// looks the same on every page, even without a reference portrait.

export function buildCharacterAnchor(input: {
  childAge?: number;
  childGender?: "boy" | "girl" | "unisex";
  attributes?: ChildAttributes;
}): string {
  const age = input.childAge ?? 4;
  const gender =
    input.childGender === "boy" ? "boy"
    : input.childGender === "girl" ? "girl"
    : "child";

  const parts: string[] = [`${age}-year-old ${gender}`];

  const a = input.attributes;
  if (a?.hairStyle && a?.hairColor) {
    parts.push(`${a.hairStyle} ${a.hairColor} hair`);
  } else if (a?.hairColor) {
    parts.push(`${a.hairColor} hair`);
  } else if (a?.hairStyle) {
    parts.push(`${a.hairStyle} hair`);
  }

  if (a?.eyeColor)  parts.push(`${a.eyeColor} eyes`);
  if (a?.skinTone)  parts.push(`${a.skinTone} skin`);
  if (a?.favoriteColor) parts.push(`wearing ${a.favoriteColor} outfit`);

  parts.push("consistent character design across all pages");

  return parts.join(", ");
}

// ─── Build image prompt from story text + theme ───────────────────────────────

function buildImagePrompt(
  storyText: string,
  theme: StoryTheme,
  input: StoryInput,
  pageNumber: number
): string {
  const characterAnchor = buildCharacterAnchor({
    childAge: input.childAge,
    childGender: input.childGender,
    attributes: input.childAttributes,
  });

  // Strip Bulgarian name from text so Flux doesn't confuse it with a style token
  const scene = storyText
    .replace(new RegExp(input.childName, "gi"), "the child")
    .replace(/[„"]/g, "")
    .slice(0, 200);

  return (
    `${characterAnchor}. ` +
    `Page ${pageNumber}: ${scene}. ` +
    `Setting: ${theme.setting}. ` +
    `Colour palette: ${theme.palette}. ` +
    `Mood: ${theme.mood}. ` +
    `The same child character maintaining exact same face from reference photo appears as hero. ` +
    FLUX_STYLE_SUFFIX
  );
}

// ─── Claude story generation ──────────────────────────────────────────────────

const CLAUDE_SYSTEM = `You are a professional award-winning Bulgarian children's book author.
You write warm, imaginative, age-appropriate stories in beautiful Bulgarian.
You always return valid JSON — no markdown fences, no extra text.`;

// Camera angles and compositions to rotate through for variety
const CAMERA_ANGLES = [
  "wide establishing shot",
  "medium shot",
  "close-up on the child's face showing emotion",
  "over-the-shoulder view",
  "low angle looking up heroically",
  "bird's eye view from above",
  "side profile action shot",
  "three-quarter view",
  "foreground child, detailed background",
  "dynamic diagonal composition",
];

function buildClaudePrompt(input: StoryInput, theme: StoryTheme, pageCount: number): string {
  const genderBg = input.childGender === "boy" ? "момче" : input.childGender === "girl" ? "момиче" : "дете";
  const introPages = 3;
  const resolutionStart = Math.floor(pageCount * 0.75) + 1;
  const a = input.childAttributes;

  // ── Hero profile block ────────────────────────────────────────────────────
  const heroProfileLines: string[] = [
    `Name: ${input.childName}`,
    `Age: ${input.childAge ?? 4}`,
    `Gender: ${genderBg}`,
  ];
  if (a?.hairStyle || a?.hairColor) {
    heroProfileLines.push(`Hair: ${[a.hairStyle, a.hairColor].filter(Boolean).join(" ")}`);
  }
  if (a?.eyeColor)          heroProfileLines.push(`Eyes: ${a.eyeColor}`);
  if (a?.skinTone)          heroProfileLines.push(`Skin tone: ${a.skinTone}`);
  if (a?.favoriteColor)     heroProfileLines.push(`Favourite colour: ${a.favoriteColor} — feature in clothing/accessories`);
  if (a?.interests)         heroProfileLines.push(`Interests: ${a.interests}`);
  if (a?.personalityTraits) heroProfileLines.push(`Personality: ${a.personalityTraits}`);

  const heroProfile = heroProfileLines.map((l) => `- ${l}`).join("\n");

  // ── Seed beats block (optional) ───────────────────────────────────────────
  const seedSection = input.seedPrompts && input.seedPrompts.length > 0
    ? `\n═══ STORY SKELETON (follow these beats exactly) ═══\n` +
      input.seedPrompts
        .map((s) => `Page ${s.page}: ${s.beat}. Image concept: ${s.image_concept}`)
        .join("\n")
    : "";

  // ── Variation twist (optional) ────────────────────────────────────────────
  const twistSection = input.variationTwist
    ? `\n═══ VARIATION TWIST (weave this into the story naturally) ═══\n${input.variationTwist}`
    : "";

  // ── Interests & personality instruction ───────────────────────────────────
  const personaliseInstruction =
    (a?.interests || a?.personalityTraits)
      ? `- Weave at least one interest (${a?.interests ?? ""}) and one personality trait (${a?.personalityTraits ?? ""}) naturally into the story — not as a forced mention but as part of the plot.`
      : "";

  return `You are writing a ${pageCount}-page personalized Bulgarian children's book for a child named "${input.childName}".

═══ HERO PROFILE (maintain visually and narratively on every single page) ═══
${heroProfile}

Story title: "${input.storyTitle}"
Genre: ${theme.genre}
Setting: ${theme.setting}
Supporting cast: ${theme.cast}
Story arc: ${theme.arc}
Mood: ${theme.mood}
${seedSection}${twistSection}

═══ STORY TEXT RULES ═══
- Each page = 4–6 rich Bulgarian sentences. This is a BOOK PAGE — write enough to fill it.
- Minimum 50 words per page, maximum 80 words.
- Use vivid sensory details: what the child sees, hears, smells, feels.
- Include natural dialogue where it fits (characters speaking to each other).
- Use "${input.childName}" naturally — 2–3 times per page max, vary with pronouns.
- Every page must ADVANCE the plot — cause leads to effect leads to next cause.
- Pages 1–${introPages}: establish the world, introduce supporting characters with personality.
- Pages ${introPages + 1}–${resolutionStart - 1}: adventure deepens, challenges arise, friendships grow.
- Pages ${resolutionStart}–${pageCount}: meaningful resolution, emotional payoff, warm happy ending.
- Vocabulary: simple but not flat. Use beautiful Bulgarian — vivid verbs, warm adjectives.
- NO generic filler phrases like "и те се забавлявали много" — every sentence must be specific and visual.
${personaliseInstruction ? `- ${personaliseInstruction}` : ""}

═══ IMAGE PROMPT RULES ═══
Each imagePromptScene MUST begin with the full character description so every illustration shows the same child:
CHARACTER: ${buildCharacterAnchor({ childAge: input.childAge, childGender: input.childGender, attributes: input.childAttributes })}

Then rotate through these camera angles for variety:
${CAMERA_ANGLES.join(" / ")}

Requirements per image prompt:
- Start with camera angle (e.g. "Wide establishing shot:")
- Describe the EXACT action happening at this moment in the story
- Name specific location details (e.g. "under a giant oak with twisted roots", not just "in the forest")
- Describe characters' exact poses, expressions, what they're holding
- 3–5 sentences of vivid English visual description

Return ONLY valid JSON (no markdown fences, no extra text):
{
  "pages": [
    {
      "pageNumber": 1,
      "storyText": "Rich Bulgarian paragraph here — 4-6 sentences, 50-80 words, vivid and specific.",
      "imagePromptScene": "CHARACTER: [copy character anchor]. Camera angle: exact action, specific location with detail, characters with expressions and poses."
    }
  ]
}`;
}

// ─── Shared JSON parser ───────────────────────────────────────────────────────

function parseStoryJson(
  raw: string,
  theme: StoryTheme,
  input: StoryInput
): StoryPage[] {
  // Strip markdown fences if model wrapped in ```json ... ```
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  const parsed = JSON.parse(cleaned) as {
    pages: Array<{ pageNumber: number; storyText: string; imagePromptScene: string }>;
  };
  return parsed.pages.map((p) => ({
    pageNumber: p.pageNumber,
    storyText: p.storyText,
    imagePrompt: buildFullImagePrompt(p.imagePromptScene, theme, input, p.pageNumber),
  }));
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateStory(input: StoryInput): Promise<StoryPage[]> {
  const pageCount = input.pageCount ?? 24;
  const theme = STORY_THEMES[input.storySlug] ?? STORY_THEMES["kosmichesko-priklyuchenie"];

  // 1. Groq (free — primary)
  if (process.env.GROQ_API_KEY) {
    try {
      return await generateWithGroq(input, theme, pageCount);
    } catch (err) {
      console.warn("[StoryGen] Groq failed, trying Claude:", err);
    }
  }

  // 2. Claude (paid — secondary)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await generateWithClaude(input, theme, pageCount);
    } catch (err) {
      console.warn("[StoryGen] Claude failed, using predefined fallback:", err);
    }
  }

  // 3. Predefined texts
  console.log("[StoryGen] No AI keys active — using predefined story texts");
  return generateFallback(input, theme, pageCount);
}

// ─── Groq path (free, primary) ────────────────────────────────────────────────

async function generateWithGroq(
  input: StoryInput,
  theme: StoryTheme,
  pageCount: number
): Promise<StoryPage[]> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  console.log(`[StoryGen] Generating ${pageCount}-page story with Groq for "${input.childName}"…`);
  const t0 = Date.now();

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 12000,
    temperature: 0.8,
    messages: [
      { role: "system", content: CLAUDE_SYSTEM },
      { role: "user",   content: buildClaudePrompt(input, theme, pageCount) },
    ],
  });

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[StoryGen] Groq story generated in ${elapsed}s`);

  const raw = response.choices[0]?.message?.content ?? "";
  return parseStoryJson(raw, theme, input);
}

// ─── Claude path (paid, secondary) ───────────────────────────────────────────

async function generateWithClaude(
  input: StoryInput,
  theme: StoryTheme,
  pageCount: number
): Promise<StoryPage[]> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  console.log(`[StoryGen] Generating ${pageCount}-page story with Claude for "${input.childName}"…`);
  const t0 = Date.now();

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 12000,
    system: CLAUDE_SYSTEM,
    messages: [
      { role: "user", content: buildClaudePrompt(input, theme, pageCount) },
    ],
  });

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[StoryGen] Claude story generated in ${elapsed}s`);

  const raw = response.content[0].type === "text" ? response.content[0].text : "";
  return parseStoryJson(raw, theme, input);
}

function buildFullImagePrompt(
  scene: string,
  theme: StoryTheme,
  input: StoryInput,
  pageNumber: number
): string {
  const characterAnchor = buildCharacterAnchor({
    childAge: input.childAge,
    childGender: input.childGender,
    attributes: input.childAttributes,
  });

  // Alternate lighting/time-of-day to force visual variety between pages
  const lightingVariants = [
    "warm golden hour sunlight",
    "soft morning mist light",
    "bright midday sun",
    "dappled forest light through leaves",
    "magical glowing light",
    "sunset orange and pink sky",
    "cool blue twilight",
    "cosy candlelight glow",
  ];
  const lighting = lightingVariants[(pageNumber - 1) % lightingVariants.length];

  return (
    `${characterAnchor}. ` +
    `${scene} ` +
    `Colour palette: ${theme.palette}. Lighting: ${lighting}. ` +
    `The child hero (same face from reference portrait photo) is the central character. ` +
    `Setting details: ${theme.setting}. ` +
    FLUX_STYLE_SUFFIX
  );
}

// ─── Fallback: predefined texts + auto-generated image prompts ────────────────

// Imported inline to avoid circular deps with face-swap.ts
const FALLBACK_TEXTS: Record<string, string[]> = {
  "kosmichesko-priklyuchenie": [
    "Имало едно време едно храбро дете на име {name}, което обичало да гледа звездите.",
    "Една нощ {name} забелязало светлина в градината — малка ракета, готова за полет!",
    "С биещо сърце {name} се качило вътре и натиснало големия червен бутон.",
    "БУМ! Ракетата профучала нагоре и {name} видяло как Земята ставала все по-малка.",
    "Около {name} блестели милиони звезди — всяка от тях криела своя тайна.",
    "Изведнъж нещо зелено и кръгло се появило пред иллюминатора — Зорко!",
    "Зорко поканило {name} да разгледат неговата планета с розови дървета.",
    "Планетата Зора имала лилави реки от сладък сок и пеещи кристали.",
    "{name} и Зорко яли плодове с вкус на дъга и се смеели до сълзи.",
    "Зорко показал на {name} тайната карта на цялата галактика.",
    "Заедно открили нова звезда и я нарекли на {name} — за вечни времена!",
    "{name} научило как да говори на езика на звездите.",
    "Двамата приятели изградили ракета от кристали и полетели към Млечния път.",
    "По пътя срещнали метеоритен дъжд — и танцували сред него!",
    "Лунният принц ги поканил на чай с лунен мед и звезден прах.",
    "На Луната {name} направило три скока и достигнало до самите облаци.",
    "Слънцето им намигнало и изпратило лъч, за да ги огрее.",
    "Дошло времето за сбогуване. Зорко дал на {name} кристал, който светел в тъмното.",
    "{name} обещало да се върне и Зорко обещало да чака.",
    "Ракетата отново профучала — надолу, надолу, към Земята.",
    "Градината изглеждала точно така, сякаш нищо не се е случило.",
    "{name} влязло вкъщи с кристала в ръка и усмивка на лицето.",
    "Тази нощ {name} заспало с поглед към прозореца, където мигала нова звезда.",
    "Краят — или може би само началото на следващото приключение на {name}.",
  ],
  "printsesata-ot-izgreva": [
    "В земята на изгряващото слънце живяло едно дете на име {name}.",
    "Всяка сутрин {name} се събуждало преди всички, за да посрещне зората.",
    "Птиците пеели само за {name} — тя знаела техния език.",
    "Една сутрин в горичката {name} намерило вълшебна корона от злато и рози.",
    "Когато я сложило, светлина заляла цялата гора и животните излезли.",
    "Лисицата, мечката и еленчето се поклонили пред {name}.",
    "\"Ти си принцесата на Изгрева!\" — провъзгласили те с един глас.",
    "{name} се засмяло и прегърнало всяко животинче едно по едно.",
    "Заедно тръгнали да открият откъде идва вълшебната корона.",
    "Пътят минавал през Серебърната гора, пълна с пеещи цветя.",
    "На края на гората ги посрещнала тъжна стара вила с наведени клони.",
    "Оказало се, че вилата тъгувала, защото никой не я обичал.",
    "{name} застанало до нея и я прегърнало с двете ръце.",
    "Изведнъж вилата разцъфтяла с хиляди рози — белезникави и розови.",
    "\"Благодаря, принцесо! Ти ме излекува с доброта!\" — зашепнала вилата.",
    "{name} разбрало, че истинската сила е в добротата.",
    "Животните зарадвали и гората огряла с топла светлина.",
    "Принцесата на Изгрева обявила, че ще пази гората завинаги.",
    "Всяко дърво, всяка птица и всяко животно я обичало.",
    "Заедно устроили голям празник под звездното небе.",
    "Лисицата донесла горски плодове, мечката — пчелен мед.",
    "Танцували и пели до зазоряване.",
    "{name} заспало в меко гнездо от цветя, щастливо и обичано.",
    "И всяка сутрин от тогава нататък зората ставала малко по-ярка.",
  ],
  "v-dzhunglata-na-priyatelite": [
    "Имало едно лято, когато {name} открило вход към тайна джунгла зад градинската порта.",
    "Огромни дървета се извисявали над {name} — листата им шепнели приятелски поздрави.",
    "Пъстър папагал кацнал на рамото на {name} и рекъл: \"Добре дошло, приятелю!\"",
    "Папагалът се представил като Рики и обещал да води {name} из вълшебната гора.",
    "{name} тръгнало по тясна пътека, украсена с огромни цъфтящи орхидеи.",
    "Зад водопад от лиани се криел малък слон с огромни кафяви очи.",
    "Слончето Тото се смутило, но {name} му подало ръка и двамата се прегърнали.",
    "Тото показал на {name} тайното езеро, в което водата светела с всички цветове.",
    "На езерото плували розови рибки, изписващи послания с опашките си.",
    "Изведнъж откъм гъсталака долетяла маймунка Коко — закачлива и смееща се.",
    "Коко откраднала шапката на {name} и я завързала на върха на най-високото дърво.",
    "{name} се засмяло и покатерило ловко нагоре, последвано от целия отряд.",
    "От върха на дървото се виждала цялата джунгла — безкрайно зелено море.",
    "Рики, Тото и Коко разказали, че джунглата е тъжна — цветята вехнели.",
    "Оказало се, че тайната пещера е затворена и дъждът не може да влезе вътре.",
    "{name} влязло храбро в пещерата и намерило запушения кристален извор.",
    "С малки ръце {name} отместило камъка и изворът избликнал с пеещ звук.",
    "Водата потекла навред — цветята се изправили, а дърветата зашумели радостно.",
    "Джунглата разцъфтяла в миг — хиляди цветя отворили венчелистчетата си.",
    "Всички животни излезли и заобиколили {name} в голям кръг на благодарност.",
    "Рики, Тото и Коко обявили {name} за \"Пазителят на Джунглата\".",
    "{name} прегърнало приятелите си и обещало да се връща всяко лято.",
    "Слънцето се подало между листата и огряло усмивката на {name}.",
    "И до ден днешен цветята в онази джунгла цъфтят по-ярко — в чест на {name}.",
  ],
  "malkiyat-gotvach": [
    "В малкото градче живяло дете на име {name}, което обичало да вдиша аромата на баница.",
    "Баба Донка имала вълшебна кухня, пълна с буркани с цветни подправки.",
    "Един ден тя поканила {name}: \"Ела, ще те науча на тайните рецепти!\"",
    "{name} сложило бялата престилка и застанало до голямата дървена маса.",
    "Дървената лъжица изскочила сама и рекла: \"Аз съм Луко — твоят помощник!\"",
    "{name} се смаяло, но Луко вече бъркал тестото с бърза ръка.",
    "Добавили прашец от звездна анасон — и тестото заблестяло в злато.",
    "Баба Донка обяснила: \"Тайната е любовта — тя прави ястията вкусни.\"",
    "{name} добавило топла мисъл за семейството и кухнята се напълнила с аромат.",
    "Изпекли кравай, украсен с рози от тесто и капки мед.",
    "Когато го изнесли на масата, съседите надошли, привлечени от миризмата.",
    "Старата баба Мара вкусила и рекла: \"Не съм яла такова нещо от детинство!\"",
    "{name} се зачервило от гордост и изрязало парче за всеки.",
    "На другия ден духчета-съставки излетели от бурканите и поискали нова рецепта.",
    "{name} и Луко измислили торта с облаче от ванилов крем и шоколадов дъжд.",
    "Духчетата кацали едно по едно и влизали доброволно в купата.",
    "Тортата поникнала на подноса като истинска гора от крем и ягоди.",
    "Целият квартал дошъл на дегустация — смях и песни огласяли улицата.",
    "{name} разбрало, че готвенето е начин да кажеш \"обичам те\" без думи.",
    "Баба Донка подарила на {name} малък бурканче с магически подправки.",
    "\"Пази ги\" — рекла тя — \"те ще ти помогнат когато имаш нужда.\"",
    "{name} прибрало бурканчето до сърцето си и обещало да готви с любов.",
    "От тогава насетне масата на {name} винаги събирала приятели и смях.",
    "Защото истинската магия в кухнята е проста: малко любов, малко смелост и много усмивки.",
  ],
  "piratite-na-cherno-more": [
    "На брега на морето {name} намерило стара бутилка с навита карта вътре.",
    "Картата показвала тайнствен остров с кръст — белег за скрито съкровище!",
    "Точно тогава на хоризонта се появил кораб с весело знаме — капитан Румен!",
    "Капитан Румен имал рошава брада, добри очи и говорил чайките.",
    "\"Качвай се, малки пирате!\" — извикал той и хвърлил въже.",
    "{name} се покачило на борда и пиратите го посрещнали с приветствени викове.",
    "Корабът профучал по вълните на Черно море под надут от вятъра платнец.",
    "Чайката-навигатор Гага прочела звездите и посочила курса към острова.",
    "По пътя попаднали в буря, но {name} се хванало здраво за мачтата.",
    "Капитан Румен извикал: \"Страхуват ли се пиратите? Никога!\" — и всички се засмели.",
    "Бурята преминала бързо и небето се разчистило в лазурно синьо.",
    "Островът се показал — зелен, с белозъби вълни и пеещи птици.",
    "{name} слязло пръв и тропнало с крак по меления пясък.",
    "Картата водела право до старото дърво с три клона — там бил знакът Х.",
    "Раковинен крабът Чавдар пазел ключа и поискал гатанка.",
    "{name} отговорило правилно и Чавдар с поклон предал ключа.",
    "Сандъкът се отворил с тъжен скрип — вътре имало монети, камъни и... писмо.",
    "Писмото гласяло: \"Истинското съкровище е приятелят, с когото го откривате.\"",
    "{name} погледнало капитан Румен, Гага и Чавдар — и се засмяло широко.",
    "Монетите раздали на децата от крайбрежното село — радостта им беше безценна.",
    "Капитан Румен вдигнал чаша с лимонада: \"За {name} — най-добрия пират!\"",
    "Корабът се завърнал под залязващото слънце, боядисало морето в злато.",
    "{name} стояло на носа и усещало морски бриз по лицето.",
    "Вкъщи пазело картата под възглавницата — и сънувало нови приключения.",
  ],
  "feyata-na-gorite": [
    "Когато луната огряла гората, {name} чуло тихо хлипане между дърветата.",
    "Следвайки звука, {name} намерило малка фея с наранено крило.",
    "Феята се казвала Сребринка и паднала от вълшебния дъб в бурята.",
    "{name} внимателно вдигнало феята и я сложило в длан — лека като перо.",
    "\"Трябва да намерим лечебния мъх\" — прошепнала Сребринка — \"но гората е тъмна.\"",
    "{name} се огледало — наоколо светлинки започнали да се появяват като малки звезди.",
    "Бяха светулки, дошли да помогнат на приятеля на феята.",
    "Осветени от светулките, {name} и Сребринка тръгнали по тясна пътека.",
    "Мъдрата сова Мирон ги посрещнал на разклонението и посочил правия път.",
    "Пътеката водела до сребърния поток, край който растял лечебният мъх.",
    "{name} наклонило се и внимателно набрало малко мъх с чисти ръце.",
    "Сребринка поставила мъха на крилото си — и то светнало в розово.",
    "Крилото зараснало пред очите на {name} — фееричен, вълнуващ миг!",
    "\"Благодаря!\" — извикала Сребринка и заобиколила {name} с розов прашец.",
    "Из гората се разнесло съобщение — дошли феи от всички краища.",
    "Кралица Силвана се появила в лъч лунна светлина с корона от звезди.",
    "\"Ти спаси една от нашите\" — рекла тя — \"и ние сме задължени.\"",
    "Кралицата набрала от магическия прашец и поръсила {name}.",
    "На раменете на {name} заблестели малки прозрачни крила — подарък от феите.",
    "{name} разперило крилата и се издигнало на педя над земята — невероятно!",
    "Цяла нощ {name} летяло с феите над буковете, рееейки се в лунната светлина.",
    "Когато зазорило, кралица Силвана казала: \"Крилата са твои — носи ги в сърцето.\"",
    "{name} кацнало меко и прегърнало Сребринка за последно сбогуване.",
    "Оттогава нататък {name} знаело, че доброто дело се връща с магия.",
  ],
  "dinozavarat-priyatel": [
    "Един ден {name} намерило в реката голямо синьо яйце, размера на диня.",
    "Яйцето потреперало в ръцете на {name} — нещо живо се намирало вътре!",
    "{name} завило яйцето в жилетката си и го занесло вкъщи.",
    "На сутринта черупката се напукала — вътре имало малко динозавърче!",
    "Малкото динозавърче погледнало {name} с огромни жълти очи и завилеело опашка.",
    "{name} го кръстило Дино и двамата станали неразделни приятели.",
    "Дино растял бързо — до края на седмицата бил вече колкото голямо куче.",
    "Заедно тичали из ливадата, а Дино прескачал реката с един скок.",
    "Птеродактилът Петко долетял от планината и поканил Дино да летят заедно.",
    "{name} гледало как Дино размахва малките крила — може би и той ще полети!",
    "Трицератопсът Тихо дошъл с подаръци — плодове с вкус на мед.",
    "Дино и Тихо се сприятелили веднага и играли спокойно заедно.",
    "Дните минавали и {name} забелязало, че Дино тъгува за нещо.",
    "Петко разказал, че Дино копнеел по Праисторическата долина — дома на динозаврите.",
    "{name} стиснало сълзите си и решило: трябва да заведе Дино там.",
    "Тихо показал тайния проход — голяма скала с нарисуван динозавър.",
    "Зад скалата се разкрила зелена долина с огромни папрати и сини реки.",
    "Динозаврите излезли да посрещнат Дино — радостни тропкания огласили долината.",
    "Дино се обърнало и погледнало {name} с тъжни очи.",
    "{name} коленичило и прегърнало Дино здраво за последно.",
    "\"Тук е домът ти\" — прошепнало {name} — \"но аз ще те помня завинаги.\"",
    "Дино лизнало лицето на {name} и побягнал при другите динозаври.",
    "Петко отнесъл {name} обратно на крилете си — тихо, под звездите.",
    "Вкъщи {name} нарисувало портрет на Дино и го окачило на стената до леглото.",
  ],
  "supergerojski-den": [
    "Събуждайки се тази сутрин, {name} усетило нещо различно.",
    "Когато скочило от леглото, {name} изхвръкнало до тавана!",
    "\"Имам суперсили!\" — извикало {name} с широка усмивка.",
    "В огледалото се появил брилянтен супергеройски костюм.",
    "Наметалото трепнало на вятъра — {name} беше готово!",
    "Из прозореца {name} видяло, че котенце е заседнало на дърво.",
    "Летейки бавно, {name} внимателно свалило котенцето.",
    "\"Ти си герой!\" — казало малкото момче от съседната улица.",
    "Но {name} знаело, че истинският герой помага — не се хвали.",
    "После {name} видяло, че старица не може да прекоси улицата.",
    "Без да се замисля, {name} хванало ръката й и я придружило.",
    "\"Благодаря, мило дете\" — казала тя с лъчезарна усмивка.",
    "В парка деца плачели — топката им паднала в блатото.",
    "{name} използвало силата си, за да я извади, без да намокри никого.",
    "По обяд {name} срещнало Солaro — легендарен супергерой.",
    "\"Сила имат мнозина\" — рекъл Солaro — \"но доброта имат малцина.\"",
    "{name} разбрало: истинската суперсила е в сърцето.",
    "Заедно те помогнали да се постави нова пейка в парка.",
    "Децата наоколо се засмели и нарекли {name} любимия си герой.",
    "Но {name} поклатило глава: \"Всеки може да е герой с доброта.\"",
    "Привечер {name} се прибрало с топло чувство в гърдите.",
    "Суперкостюмът изчезнал, ама силата останала — вътре в сърцето.",
    "На следващата сутрин {name} се събудило с нова мисия.",
    "Защото всеки ден е ден за добрини — и това е истинският супергеройски ден!",
  ],
};

function generateFallback(
  input: StoryInput,
  theme: StoryTheme,
  pageCount: number
): StoryPage[] {
  const rawTexts = FALLBACK_TEXTS[input.storySlug] ?? FALLBACK_TEXTS["kosmichesko-priklyuchenie"];
  const SENTENCES_PER_PAGE = 4; // combine 4 sentences to make a rich page
  return Array.from({ length: pageCount }, (_, i) => {
    // Take 4 consecutive sentences, wrapping around if needed
    const sentences = Array.from({ length: SENTENCES_PER_PAGE }, (__, j) =>
      rawTexts[(i * SENTENCES_PER_PAGE + j) % rawTexts.length]
    );
    const storyText = sentences.join(" ").replace(/{name}/g, input.childName);
    return {
      pageNumber: i + 1,
      storyText,
      imagePrompt: buildImagePrompt(storyText, theme, input, i + 1),
    };
  });
}

// ─── Re-export negative prompt for use in replicate.ts ───────────────────────
export { FLUX_NEGATIVE };
