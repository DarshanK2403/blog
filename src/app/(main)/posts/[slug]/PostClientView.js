// app/posts/[slug]/page.js
import EditorJsHtml from "editorjs-html";
import styles from "./page.module.css";
import { getPostDirect } from "@/app/lib/postUtils";

const customParsers = {
  image: (block) => {
    const slug = block.data?.file?.slug;
    const url = slug ? `/img/${slug}` : block.data?.file?.url;
    const alt = block.data?.caption || "Image";
    return `<img src="${url}" alt="${alt}" class="editorjs-image" />`;
  },
};

const editorJsHtml = EditorJsHtml(customParsers);

function enforceTargetBlank(html) {
  return html.replace(
    /<a\s+href=["'](.*?)["'](?![^>]*target=)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );
}

export default async function PostDetailPage({ slug }) {
  // const slug = params.slug;
  const post = await getPostDirect(slug);
  console.log("Post view", slug);
  if (!post) return <div className="p-5">Post not found</div>;

  const blocks = post?.content?.blocks?.map((block) => {
    if (block.type === "image" && block.data?.file?.slug) {
      return {
        ...block,
        data: {
          ...block.data,
          file: {
            ...block.data.file,
            url: `/img/${block.data.file.slug}`,
          },
        },
      };
    }
    return block;
  });

  const parsed = editorJsHtml.parse({ ...post.content, blocks });
  const joinedHtml = Array.isArray(parsed)
    ? parsed.join("")
    : parsed?.toString?.() || "";
  const html = enforceTargetBlank(joinedHtml);

  return (
    <div className="p-2 max-w-3xl mx-auto mt-5">
      <h1 className={styles.poster}>{post.title}</h1>
      <div className="min-h-60 bg-white p-4">
        <div
          className={styles.post}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
