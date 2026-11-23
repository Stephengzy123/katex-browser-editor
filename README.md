# KaTeX Editor

A lightweight, offline math editor for writing equations, notes, and worked solutions. Type LaTeX and see the result immediately.

[Open the hosted editor](https://stephengzy123.github.io/katex-browser-editor/).

[Offline download page](https://stephengzy123.github.io/katex-browser-editor/download.html).

## Getting started

On the offline download page, click **Download HTML file**, then open the saved `KaTeX Editor.html` in a modern browser. The standalone file includes all the CSS and JavaScript it needs.

## Features

- Live KaTeX preview
- Equation mode and Text + math mode
- Up to 10 named tabs with separate documents, images, and undo/redo histories
- Notation builders and formatting helpers
- Basic Markdown formatting
- Local PNG/JPEG image insertion with resizing
- Light and dark themes
- PDF and source downloads
- Session import/export, including images and edit history

## Writing math

In **Equation** mode, enter LaTeX directly:

```latex
\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}
```

In **Text + math** mode, mix ordinary text with inline or display math:

```latex
The resistance is $R=\frac{V^2}{P}$.

$$
R=\frac{52900}{4180}\approx12.6\,\Omega
$$
```

Supported delimiters include `$…$`, `$$…$$`, `\(…\)`, and `\[…\]`.

Use **Insert notation** to build formulas from editable fields. Use **Format** to apply alignment or other layouts to selected source text.

## Basic Markdown

Text + math mode supports:

- `**bold**`
- `*italic*` or `_italic_`
- `~~strikethrough~~`
- `# Heading`
- Bulleted and numbered lists
- Inline code and fenced code blocks

LaTeX inside math delimiters is preserved. Raw HTML, links, and external Markdown images are displayed as literal text.

## Images

Use **Insert image** in Text + math mode, with the cursor outside a formula.

Choose the image width before inserting it, then resize or remove it from the preview. Image-editing controls are hidden while the preview is expanded.

Image limits:

- PNG and JPEG only
- Maximum input size: 10 MB
- Maximum input resolution: 25 megapixels and 16,000 pixels per side
- Images are re-encoded and reduced to at most 2,400 pixels per side
- Maximum stored size: 5 MB per image and 25 MB per tab
- Maximum 32 stored images per tab, including images retained for undo

Images are included in PDFs and session backups. Image markers are omitted from `.tex` downloads.

## Tabs and settings

Use **New tab** to create a document. Click a tab’s pencil icon to rename it.

The tab name is used for source and session downloads and suggested as the PDF filename.

Open the **settings gear** beside New tab to manage:

- Light or dark appearance
- Full-size math for the current tab
- Downloads
- Session import/export
- Backups of all tabs
- Features and help

Full-size math defaults to on for new tabs. Each tab remembers its own setting.

## Saving and undo

Documents, images, and edit histories save automatically in the current browser.

Keyboard shortcuts:

| Action | macOS | Windows/Linux |
|---|---|---|
| Undo | Cmd-Z | Ctrl-Z |
| Redo | Cmd-Shift-Z | Ctrl-Shift-Z or Ctrl-Y |

Undo/redo history survives reloads. There is no application-imposed edit-count cap, but browser storage limits still apply.

Browser storage is not a permanent backup. Clearing browser data, using a different browser profile, or moving the editor may make saved work unavailable. Export JSON backups regularly.

## Downloads and backups

### PDF

Choose **Settings → Download PDF**, then select **Save as PDF** in the browser’s print dialog.

The PDF prints the rendered preview, using the current tab’s Full-size math setting. Editor controls are excluded, and the page uses a white background.

### LaTeX source

Choose **Download .tex** to save the typed source with image markers removed.

Markdown remains Markdown in this download. The editor does not convert the document into a complete, compilable LaTeX project.

### Sessions

- **Export session:** backs up the current tab, including its images and undo/redo history.
- **Export all tabs:** backs up every open tab.
- **Import session:** opens a single-session backup in a new tab when space is available. Importing an all-tabs backup restores its saved set of tabs.

Keep exported JSON files somewhere separate from the browser.

## Privacy

Documents and images are processed locally. The editor does not upload them to a server.

Files you download or share may contain your document text, images, and—when exporting sessions—previous edits.

## Limitations

- KaTeX supports a subset of LaTeX math notation; this is not a full LaTeX compiler.
- PDF output uses browser printing, so print settings can affect pagination.
- Very wide equations may be reduced in size to fit the PDF page.
- Saved work is local to the browser and is not automatically synchronized between devices.

## Acknowledgments

Math rendering is powered by [KaTeX](https://katex.org/).

## License

The editor code is licensed under the [MIT License](LICENSE), copyright
2026 Ziyu Gu.

Bundled KaTeX code uses MIT, and the bundled KaTeX fonts use the SIL Open Font
License 1.1. See [third-party notices](THIRD_PARTY_NOTICES.md) for the full license
texts and attributions. The standalone HTML includes these notices as well.

<small>Note: This README was generated by ChatGPT.</small>

## Development

The hosted editor starts at `src/index.html`. Edit the markup there, the app
styles in `src/editor.css`, or the app logic in `src/editor.js`. The bundled
KaTeX assets are in `src/vendor/`.

After editing the source, run `python3 scripts/build-offline.py` to regenerate
`KaTeX Editor.html` for offline downloads. Commit the source and regenerated
file together.
