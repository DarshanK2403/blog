// components/PageComponent.js
"use client";

import EditorJsHtml from "editorjs-html";
import styles from "./page.module.css";
import Loading from "@/app/loading";

const editorJsHtml = EditorJsHtml();

export default function PageComponent({ content }) {
  if (!content?.blocks) return <Loading />;

  // 🖼️ Replace image URL if slug exists
  const blocks = content.blocks.map((block) =>
    block.type === "image" && block.data?.file?.slug
      ? {
          ...block,
          data: {
            ...block.data,
            file: {
              ...block.data.file,
              url: `/img/${block.data.file.slug}`,
            },
          },
        }
      : block
  );

  // 🔗 Convert to HTML
  const parsed = editorJsHtml.parse({ ...content, blocks });
  const enforceTargetBlank = (html) =>
    html.replace(
      /<a\s+href=["'](.*?)["'](?![^>]*target=)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"'
    );

  const htmlOutput = enforceTargetBlank(
    Array.isArray(parsed) ? parsed.join("") : parsed.toString()
  );

  return (
    <div style={{ minHeight: "400px" }}>
      <div
        className={styles.post}
        dangerouslySetInnerHTML={{ __html: htmlOutput }}
      />
    </div>
  );
}
