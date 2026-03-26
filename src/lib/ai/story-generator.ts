import type { ArtStyle, Story } from "@/types"

export interface StoryGenerator {
  generateStory(characterName: string, style: ArtStyle): Promise<Story>
}

const storyTemplates: Record<ArtStyle, (name: string) => Story> = {
  comic: (name: string): Story => ({
    title: `The Incredible ${name}: City of Heroes`,
    characterName: name,
    pages: [
      {
        pageNum: 1,
        text: `In the bustling city of Metropolix, ${name} was just an ordinary person — until a mysterious meteor shower changed everything forever.`,
        sceneDescription: "City skyline at night with falling meteors, hero in foreground looking up",
      },
      {
        pageNum: 2,
        text: `The next morning, ${name} discovered they could leap over buildings and deflect lasers with their hands. Their life would never be the same!`,
        sceneDescription: "Hero leaping between buildings in superhero pose",
      },
      {
        pageNum: 3,
        text: `Meanwhile, the villainous Dr. Destructo and his army of robots had begun terrorizing the city. Only ${name} could stop them!`,
        sceneDescription: "Giant robot stomping through city, villain laughing maniacally",
      },
      {
        pageNum: 4,
        text: `"ENOUGH!" shouted ${name}, flying down from the clouds. "This city is under MY protection!" The ground shook as they landed with a thunderous BOOM!`,
        sceneDescription: "Hero landing in power pose creating shockwave, robots scattering",
      },
      {
        pageNum: 5,
        text: `A fierce battle erupted! ${name} dodged laser beams and crushed robots with their bare hands. KAPOW! ZAPP! CRASH!`,
        sceneDescription: "Dynamic action sequence with explosions and hero fighting robots",
      },
      {
        pageNum: 6,
        text: `Dr. Destructo launched his ultimate weapon — the Doom Cannon! But ${name} caught the beam and hurled it back, destroying the machine!`,
        sceneDescription: "Hero catching energy beam and redirecting it at villain's cannon",
      },
      {
        pageNum: 7,
        text: `The villain was defeated. The city erupted in celebration! People cheered as ${name} stood tall above the ruins, a true hero.`,
        sceneDescription: "Hero standing triumphantly as grateful citizens cheer below",
      },
      {
        pageNum: 8,
        text: `${name} smiled and waved to the crowd. Being a hero wasn't about the powers — it was about courage, heart, and never giving up. THE END.`,
        sceneDescription: "Hero waving goodbye to citizens as sun sets behind them",
      },
    ],
  }),

  anime: (name: string): Story => ({
    title: `${name} and the Crystal of Eternity`,
    characterName: name,
    pages: [
      {
        pageNum: 1,
        text: `${name} was a student at the Celestial Academy, training to become a Starlight Guardian. But their destiny was far greater than anyone could imagine.`,
        sceneDescription: "Magical academy on floating island, hero in school uniform with glowing aura",
      },
      {
        pageNum: 2,
        text: `One night, ${name} discovered a glowing crystal in the forbidden forest. It resonated with their soul, awakening extraordinary powers within them.`,
        sceneDescription: "Character reaching toward glowing crystal in mystical forest",
      },
      {
        pageNum: 3,
        text: `"Your power level is... impossible!" gasped ${name}'s rival Kaito. The crystal had granted ${name} the ability to control time and space itself!`,
        sceneDescription: "Rival character shocked by power display, energy crackling around hero",
      },
      {
        pageNum: 4,
        text: `Dark forces heard of the crystal. The Shadow Dragon appeared, blotting out the sun. ${name}'s friends were in danger — it was time to transform!`,
        sceneDescription: "Shadow dragon looming over city, hero preparing to transform",
      },
      {
        pageNum: 5,
        text: `"CELESTIAL STAR AWAKENING!" ${name} shouted, releasing a blinding light. Their uniform transformed into legendary Starlight Armor!`,
        sceneDescription: "Magical transformation sequence with stars and light beams",
      },
      {
        pageNum: 6,
        text: `The battle was intense! ${name} channeled the crystal's power into a massive energy beam. "CRYSTAL NOVA BLAST!!!" The dragon reeled back!`,
        sceneDescription: "Hero firing massive energy beam at dragon, colors exploding everywhere",
      },
      {
        pageNum: 7,
        text: `"Why do you fight so hard?" demanded the dragon. ${name} looked at their friends and answered: "For them. For everyone I love. That's my destiny!"`,
        sceneDescription: "Emotional confrontation, hero standing firm with friends visible behind",
      },
      {
        pageNum: 8,
        text: `The dragon was purified by ${name}'s love and light, transforming into a guardian of the sky. ${name} had not just won a battle — they had gained an ally. THE END.`,
        sceneDescription: "Dragon transforming into majestic light creature, hero smiling at it",
      },
    ],
  }),

  watercolor: (name: string): Story => ({
    title: `${name} and the Painted Garden`,
    characterName: name,
    pages: [
      {
        pageNum: 1,
        text: `${name} was an artist who lived in a tiny cottage beside the most magical garden in the world — a garden where paintings came to life.`,
        sceneDescription: "Cozy cottage surrounded by blooming garden with soft morning light",
      },
      {
        pageNum: 2,
        text: `Each morning, ${name} would paint and the flowers would dance, butterflies would twirl, and rivers of color would flow through the air.`,
        sceneDescription: "Artist painting at easel with magical colors flowing from brush",
      },
      {
        pageNum: 3,
        text: `But one grey morning, ${name} woke to find all color had vanished from the world. Even the beloved garden stood still and grey.`,
        sceneDescription: "Colorless landscape with sad-looking plants and grey sky",
      },
      {
        pageNum: 4,
        text: `The Rainbow Sprite appeared, crying tiny crystal tears. "The Storm of Grey has stolen the colors! Only the Heart Brush can restore them!"`,
        sceneDescription: "Tiny sprite hovering with crystalline tears, pointing toward storm clouds",
      },
      {
        pageNum: 5,
        text: `${name} journeyed through the colorless world, collecting drops of color wherever they found them — a petal here, a drop of sky there.`,
        sceneDescription: "Hero collecting color drops in jars on misty grey path",
      },
      {
        pageNum: 6,
        text: `At the heart of the Storm, ${name} found the Heart Brush. With love and courage, they painted strokes of pure color across the sky.`,
        sceneDescription: "Hero painting colors into the grey storm with magical brush",
      },
      {
        pageNum: 7,
        text: `Colors burst back into the world like a sunrise! Flowers bloomed, birds sang in painted songs, and the garden danced with more beauty than ever before.`,
        sceneDescription: "Explosion of colors returning to the world, flowers blooming everywhere",
      },
      {
        pageNum: 8,
        text: `${name} smiled, brush in hand, as the Rainbow Sprite danced on their shoulder. The world was beautiful again — because of love and the courage to create. THE END.`,
        sceneDescription: "Artist with sprite, surrounded by colorful magical garden at sunset",
      },
    ],
  }),

  storybook: (name: string): Story => ({
    title: `${name} and the Enchanted Forest`,
    characterName: name,
    pages: [
      {
        pageNum: 1,
        text: `Once upon a time, in a cozy village at the edge of an enchanted forest, there lived a child named ${name} who was very, very curious.`,
        sceneDescription: "Charming village with colorful houses, forest visible in background",
      },
      {
        pageNum: 2,
        text: `One sunny morning, a talking bluebird flew to ${name}'s window. "The Forest Princess is lost! Will you help find her?" chirped the bird.`,
        sceneDescription: "Cute bluebird talking to child at window, morning sunshine",
      },
      {
        pageNum: 3,
        text: `${name} packed a little basket with cookies and set off into the magical forest, where the trees had friendly faces and mushrooms were the size of houses!`,
        sceneDescription: "Child with basket entering whimsical forest with giant mushrooms",
      },
      {
        pageNum: 4,
        text: `A wise old owl gave ${name} a glowing lantern. A family of rabbits offered clover cookies. Everyone wanted to help on this important quest!`,
        sceneDescription: "Child receiving lantern from owl while rabbits offer treats",
      },
      {
        pageNum: 5,
        text: `Deep in the forest, ${name} found a sleeping dragon blocking a cave. But this dragon wasn't scary — he was just very, very sleepy!`,
        sceneDescription: "Small cute snoring dragon blocking cave entrance",
      },
      {
        pageNum: 6,
        text: `${name} offered the dragon a cookie, and the dragon woke with a big smile! "Thank you, friend!" he said. "The princess is inside — I was protecting her!"`,
        sceneDescription: "Dragon happily eating cookie, child looking surprised and happy",
      },
      {
        pageNum: 7,
        text: `The Forest Princess was delighted to be found! "I got lost gathering moonflowers," she laughed. Together, they danced all the way back through the forest.`,
        sceneDescription: "Child and princess dancing through beautiful forest with fireflies",
      },
      {
        pageNum: 8,
        text: `${name} returned home as the moon rose. Mother hugged them tight. "${name}," she whispered, "you have the kindest and bravest heart in all the land." THE END.`,
        sceneDescription: "Warm home scene, child hugged by parent with full moon outside",
      },
    ],
  }),

  "pop-art": (name: string): Story => ({
    title: `${name}: POP! Goes the World`,
    characterName: name,
    pages: [
      {
        pageNum: 1,
        text: `${name} was THE most stylish person in the city of NEON-VILLE! With a snap of their fingers, they could make anything fabulous. POP!`,
        sceneDescription: "Stylish character against bold pop art background with bright colors",
      },
      {
        pageNum: 2,
        text: `"DARLING!" said the mayor. "Our city has lost its FLAIR! Everything has turned beige! Only YOU can bring back the color!" BAM! KAPOW!`,
        sceneDescription: "Boring beige city with shocked mayor, hero looking determined",
      },
      {
        pageNum: 3,
        text: `${name} pulled on their most FABULOUS outfit and launched into action. First stop: the Boring Business District. TRANSFORM!`,
        sceneDescription: "Hero in bold outfit against dotted background, pointing dramatically",
      },
      {
        pageNum: 4,
        text: `With a POP of color and a SNAP of style, ${name} painted the offices hot pink, the streets neon yellow, and the sky electric blue! WOW!`,
        sceneDescription: "Buildings transforming to bright colors with POW! effect labels",
      },
      {
        pageNum: 5,
        text: `The BEIGE BARON appeared! "STOP! Color gives people TOO MUCH JOY!" he shrieked. "NEVER!" declared ${name}. "Joy is the WHOLE POINT!"`,
        sceneDescription: "Villain in grey with beige weapon vs colorful hero, dramatic standoff",
      },
      {
        pageNum: 6,
        text: `${name} aimed their Color Cannon and BOOM! A MASSIVE wave of rainbow color washed over the villain — and he LOVED IT! ZAP! SHINE!`,
        sceneDescription: "Rainbow explosion from cannon hitting villain who transforms colorfully",
      },
      {
        pageNum: 7,
        text: `The former villain began dancing in the streets! ${name} had shown everyone that color, joy, and self-expression made the whole world BETTER!`,
        sceneDescription: "Former villain and hero dancing with colorful celebrating crowd",
      },
      {
        pageNum: 8,
        text: `Neon-Ville was NEVER beige again. And ${name} became the official Minister of Fabulousness. Because everyone deserves to live in FULL COLOR. THE END.`,
        sceneDescription: "Hero in center of celebration with 'Minister of Fabulousness' sash, confetti everywhere",
      },
    ],
  }),

  pixel: (name: string): Story => ({
    title: `${name}: Quest for the Golden Cartridge`,
    characterName: name,
    pages: [
      {
        pageNum: 1,
        text: `In the Pixel Realm, 8-bit hero ${name} received a quest: the legendary Golden Cartridge had been stolen by the Dark Glitch. PRESS START!`,
        sceneDescription: "Pixel art hero on start screen with quest scroll, retro game UI elements",
      },
      {
        pageNum: 2,
        text: `Level 1: The Mushroom Meadows! ${name} bounced on pixelated platforms, collected power-ups, and defeated slimes. +100 EXP! LEVEL UP!`,
        sceneDescription: "Pixel art platformer scene with mushrooms and slimes, score counter",
      },
      {
        pageNum: 3,
        text: `Level 2: The Crystal Caves! Spiky bats and rolling boulders blocked the path. But ${name} had learned pixel-perfect timing. COMBO x10!`,
        sceneDescription: "Dark cave with pixel hazards, hero dodging with perfect timing",
      },
      {
        pageNum: 4,
        text: `Boss Battle! A giant pixel dragon appeared! HP: 9999! ${name} had 3 lives left. This was the ultimate challenge. BOSS MUSIC INTENSIFIES!`,
        sceneDescription: "Giant pixel dragon with health bar, hero with weapons ready",
      },
      {
        pageNum: 5,
        text: `${name} discovered the dragon's weakness: its glowing heart pixel! Three perfect hits, dodging fireballs. CRITICAL HIT! CRITICAL HIT! CRITICAL HIT!`,
        sceneDescription: "Action sequence showing three critical hits on glowing weak point",
      },
      {
        pageNum: 6,
        text: `DRAGON DEFEATED! The Dark Glitch appeared, absorbing the dragon's power. "GAME OVER — for YOU!" But ${name} had one more trick. GAME GENIE ACTIVATE!`,
        sceneDescription: "Dark villain appearing in lightning with absorbed powers, hero glowing",
      },
      {
        pageNum: 7,
        text: `${name} activated the secret cheat code — not for power, but to restore all corrupted pixels! The entire Pixel Realm began to heal!`,
        sceneDescription: "Pixel realm being restored, glitch pixels transforming back to normal",
      },
      {
        pageNum: 8,
        text: `The Golden Cartridge was returned. "${name} has saved the Pixel Realm!" rang out the 8-bit victory fanfare. CONGRATULATIONS! INSERT COIN TO PLAY AGAIN! THE END.`,
        sceneDescription: "Victory screen with hero holding golden cartridge, fireworks in pixel art",
      },
    ],
  }),
}

export const mockStoryGenerator: StoryGenerator = {
  async generateStory(characterName: string, style: ArtStyle): Promise<Story> {
    // Simulate async generation delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    const template = storyTemplates[style]
    return template(characterName)
  },
}

export const storyGenerator = mockStoryGenerator
