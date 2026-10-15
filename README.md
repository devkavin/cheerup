# A Little Something for My Favourite Menace 🧶🩷

A cozy, interactive pastel mini-experience built as a personal gift for a close friend who had a rough day at school.

## ✨ Features & Scenes

1. **Scene 1: The Welcome 🩷**
   - Soft pastel background with drifting hearts, stars, and bouncing yarn ball.
   - Interactive crocheted bunny that greets you.
   - Tactile pill button: `"I require emotional compensation →"`.
   - Hidden secret star with a sweet easter-egg note.

2. **Scene 2: Sir Fluffington III 🐰**
   - Certified emotional support creature, unlicensed therapist, professional cutie.
   - Interactive crocheted plushie with yarn-stitch textures, floppy ears, rosy cheeks, and dynamic facial expressions (idle, surprised, smug, hugs, sly, blushing).
   - Pat counter tracking affection.
   - **Fixed 6-tap sequence** culminating in the exact sincere hair compliment:
     > *"Hey, one more thing. I know you've been feeling a little upset about your hair lately, but I genuinely think it's beautiful. Yes, even when you don't. And no, you're not allowed to argue with a bunny. 🩷"*
   - Taps 7+ rotate through witty, affectionate messages.
   - Unlocks `"Okay, what's next? 💌"`.

3. **Scene 3: A Little Letter 💌**
   - Crocheted lace doily with a sealed envelope sitting on top.
   - Interactive heart-shaped wax seal that breaks in two on tap.
   - 3D envelope opening animation and letter sliding out.
   - Beautiful handwriting stationery with thoughtful, comforting message.

4. **Scene 4: Emergency Serotonin Dispenser 🍓**
   - Retro pastel vending machine with striped awning, display screen, blinking lights, candy buttons, and heart dispensing bay.
   - Dispenses random comforting/funny serotonin cards held by washi tape.
   - Rare cute "malfunction" triggering confetti and heart rain.
   - Tracks emergency smiles delivered.

5. **Scene 5: The Crochet Heart Finale 🧶**
   - Unfinished crocheted heart with animated working yarn thread and crochet hook.
   - Every tap adds a stitch with popping feedback and progress bar (16 stitches to complete).
   - Once completed, the heart gently transforms into **two crocheted creatures hugging**.
   - Progressive reveal of reassuring final messages:
     - *"Until I can give you a proper hug, this one's going to have to do."*
     - *"P.S. You don't have to thank me for this, silly. I wanted to."*
     - *"And if today still sucks, that's okay too. You don't have to feel better just because I made you something. I'm still here."*
   - Repeatable `"One more hug? 🥺"` button that squeezes the characters with floating hearts and sparkles.

---

## 🛠️ Tech Stack

- **React 18** + **Vite 6** + **TypeScript**
- **Tailwind CSS v4**
- **Motion for React** (`motion`)
- **Lucide React**
- **Mobile-first, responsive SVG & CSS art** (no emojis as core artwork)
- Fully zero-backend, zero-database, zero-auth, privacy-first.

---

## 🚀 Local Development

To run the app locally:

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser (or use responsive device mode for mobile view).

---

## 🚢 Deploying to Vercel

The repository is pre-configured with `vercel.json` for one-click deployment:

### Option A: Via GitHub
1. Push this repository to GitHub.
2. In your [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New Project"** and import the repository.
3. Keep the default settings (Framework Preset: Vite, Build Command: `npm run build`, Output Directory: `dist`).
4. Click **Deploy**.

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 💌 Customizing Messages

All text, titles, jokes, and compliments are centralized in:
[`src/content.ts`](file:///d:/Dev/Projects/coolify/cheerup/src/content.ts)

You can easily adjust any message without touching component logic.
