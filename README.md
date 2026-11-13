# The Journey Log — Rushikesh Jadhav

Personal site: work in water resources, remote sensing & GIS, model automation and decision support, plus the weekly brief, writing and hobbies.

**Live:** https://jrushi29.github.io

Plain HTML/CSS/JS with no build step and no framework. Edit a file, commit, and GitHub Pages republishes in about a minute.

## Pages

| File | Section | Status |
|---|---|---|
| `index.html` | Journey: intro + filterable log | Live content |
| `dev-research.html` | Projects, roadmap, toolkit | Live content |
| `brief.html` | Water, Climate & AI Brief: latest + archive | Framework ready |
| `editions/_template.html` | Template for one brief edition | Template |
| `articles.html` | Long-form articles | Template |
| `writing.html` | Essays & vlogs | Template |
| `hobbies.html` | Travel / Reading / Opinions tabs | Template |
| `about.html` | Bio, at-a-glance, links | Live content + placeholders |

Search for `EDIT:` in any file to find what to fill in.

## Common edits

**Add a log entry (home page):** copy an `<article class="entry">` block in `index.html` and paste it at the top of the list. `data-category` must be one of `dev, research, brief, articles, personal, hobbies`.

**Publish a brief edition:**
1. Copy `editions/_template.html` to `editions/YYYY-MM-DD.html` and fill it in.
2. In `brief.html`, update the lead story and add a line to the archive list.
3. Add a `brief` entry to the home log.

**Public content rule:** describe methods and tools only. No client or government data, no project, site, dam or event names. The public brief carries news and analysis only.

**Downloads:** tool packs live in `downloads/` (e.g. `downloads/DamBreak_Map_Series_v1.0.zip`, linked from `dev-research.html#maps`). Check a pack for client data before adding it.

**Add images:** put them in `images/`. Expected files:
- `images/profile.jpg` (About page)
- `images/og-cover.png` (link preview, already included)
- project screenshots made with sample data only

**Social links:** replace `YOUR-LINKEDIN`, `YOUR-INSTAGRAM` and `YOUR-EMAIL` in `about.html` and in the footer of every page.

**Change colours or fonts:** edit the variables at the top of `css/style.css`.
