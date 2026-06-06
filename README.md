# IELTS Core Thematic Vocabulary Explorer

An interactive flashcard site for IELTS preparation — **547 core words** across **10 themed chapters**, with example sentences, collocations, synonym discrimination, and study notes (English / 繁體中文).

🔒 Access-gated · 🎴 Browse & Quiz modes · 📈 Progress memory

## Chapters

| # | Theme | 主題 | Words |
|---|-------|------|-------|
| 01 | Personality, Character & Human Behaviour | 人格特質與人類行為 | 51 |
| 02 | Time, Change & Science Processes | 時間、變遷與科學程序 | 55 |
| 03 | Work, Careers & Professional Skills | 職場發展與專業素養 | 56 |
| 04 | Business, Marketing & Consumerism | 商業行銷與消費貿易 | 55 |
| 05 | Science, Technology & Materials | 科學研究、科技與材料 | 54 |
| 06 | Nature, Wildlife & Travel | 自然生態、野生動物與旅遊 | 53 |
| 07 | Environment, Weather & Energy | 環境保育、氣象與能源 | 55 |
| 08 | Government, Society & Urban Life | 政府體制、都市生活與社會議題 | 55 |
| 09 | Crime, Law & Society | 犯罪法律與社會危機 | 56 |
| 10 | Media, Arts & Celebrity Culture | 大眾媒體、藝術文化與名人 | 57 |

## Features

- **Two study modes** — *Browse* (word → meaning) and *Quiz* (meaning → recall).
- **Rich cards** — IPA, part of speech, two example sentences, collocations, synonyms with usage notes, and a learning tip per word.
- **Progress memory** — "Know it" / "Review" tracking and completion percentage, saved per chapter in the browser.
- **Keyboard shortcuts** — `←/→` navigate, `F` flip, `K` mark known.

## Access

The site is protected by a teacher-provided access code. "Remember this device" keeps you signed in for 30 days; one unlock covers every chapter.

> **Note:** the gate (`gate.js`) is a **client-side deterrent, not real security**. The access code is never stored — only its SHA-256 digest is compared — but anyone with browser devtools can bypass the gate, and the word data is directly downloadable. Use it to restrict casual access, not to protect sensitive content.

## Run locally

```bash
python -m http.server 8000
# then open http://localhost:8000/index.html
```

## Deploy (GitHub Pages)

Push to a repository, then **Settings → Pages → Deploy from branch → `main` / root**.

## Files

```
index.html        Chapter index
unit01–10.html    Self-contained chapter flashcard apps
gate.js           Shared access gate (lock screen)
```
