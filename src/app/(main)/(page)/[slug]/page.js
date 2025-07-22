// app/(main)/(organization)/[slug]/page.js

import { notFound } from "next/navigation";
import EditorJsHtml from "editorjs-html";
import styles from "./page.module.css";
import Loading from "@/app/loading";

const editorJsHtml = EditorJsHtml();

export default async function Page({ params }) {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  let json;
  try {
    json = await res.json();
  } catch (err) {
    console.error("Error parsing JSON:", err);
    notFound();
  }

  const { data: postData, success } = json;

  if (!success || !postData || !postData.content?.blocks) {
    notFound();
  }

  // 🖼️ Replace image URL if slug exists
  const blocks = postData.content.blocks.map((block) =>
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

  // 🔗 Make all links open in new tab
  const enforceTargetBlank = (html) =>
    html.replace(
      /<a\s+href=["'](.*?)["'](?![^>]*target=)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"'
    );

  // 🧠 Convert Editor.js blocks to HTML
  const parsed = editorJsHtml.parse({ ...postData.content, blocks });
  const htmlOutput = enforceTargetBlank(
    Array.isArray(parsed) ? parsed.join("") : parsed.toString()
  );

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <div className="min-h-60 bg-white p-4">
        <div className={styles.post} style={{ minHeight: "400px" }}>
          {htmlOutput ? (
            <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
          ) : (
            <Loading/>
          )}
        </div>
      </div>
    </div>
  );
}
