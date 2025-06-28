"use client";
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";

class SimpleHR {
  static get toolbox() {
    return {
      title: "Horizontal Rule",
      icon: '<svg width="20" height="20" viewBox="0 0 20 20"><line x1="0" y1="10" x2="20" y2="10" stroke="black" stroke-width="2"/></svg>',
    };
  }

  constructor({ data }) {
    this.data = data || {
      code: '<hr class="my-4 border-t border-gray-300" />',
    };
  }

  render() {
    this.wrapper = document.createElement("div");
    const hr = document.createElement("hr");
    hr.className = "my-4 border-t border-gray-300";
    this.wrapper.appendChild(hr);
    return this.wrapper;
  }

  save() {
    return {
      code: '<hr class="my-4 border-t border-gray-300" />',
    };
  }
}

const EditorComponent = forwardRef(({ formData = {}, onImageAdd }, ref) => {
  const editorRef = useRef(null);
  const editorHolderRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const imageCountRef = useRef(0);
  const loggedImages = useRef(new Set());

  useImperativeHandle(ref, () => ({
    async save() {
      if (editorRef.current) {
        return await editorRef.current.save();
      }
      return null;
    },
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initEditor = async () => {
      if (editorRef.current) return;

      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Table = (await import("@editorjs/table")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        const Marker = (await import("@editorjs/marker")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;
        const Checklist = (await import("@editorjs/checklist")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const Warning = (await import("@editorjs/warning")).default;
        const CodeTool = (await import("@editorjs/code")).default;
        const Underline = (await import("@editorjs/underline")).default;
        const Embed = (await import("@editorjs/embed")).default;
        const LinkTool = (await import("@editorjs/link")).default;
        const Columns = (await import("@calumk/editorjs-columns")).default;

        const editor = new EditorJS({
          holder: editorHolderRef.current,
          autofocus: true,
          placeholder: "Start writing your awesome content here...",
          tools: {
            header: { class: Header, inlineToolbar: true },
            list: { class: List, inlineToolbar: true },
            quote: Quote,
            table: Table,
            image: {
              class: class {
                static get toolbox() {
                  return { title: "Image", icon: "🖼️" };
                }

                constructor({ data, api }) {
                  this.api = api;
                  this.data = data;
                  this.wrapper = undefined;
                }

                render() {
                  this.wrapper = document.createElement("div");

                  const fileInput = document.createElement("input");
                  fileInput.type = "file";
                  fileInput.accept = "image/*";
                  fileInput.style.display = "none";

                  fileInput.addEventListener("change", async () => {
                    const file = fileInput.files[0];
                    if (!file) return;

                    const slugInput = prompt(
                      "Enter a custom slug (no extension)"
                    );
                    if (!slugInput) return alert("Slug is required!");

                    const formData = new FormData();
                    formData.append("image", file);
                    formData.append("slug", slugInput);

                    try {
                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const result = await res.json();
                      if (result.success) {
                        this.data = {
                          file: {
                            url: result.file.url,
                            slug: result.file.slug,
                          },
                          caption: slugInput,
                        };
                        this._updateView();
                      }
                    } catch (err) {
                      console.error("Image upload failed", err);
                    }
                  });

                  const uploadBtn = document.createElement("button");
                  uploadBtn.textContent = "Upload Image";
                  uploadBtn.className =
                    "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";
                  uploadBtn.onclick = () => fileInput.click();

                  this.wrapper.appendChild(uploadBtn);
                  this.wrapper.appendChild(fileInput);
                  return this.wrapper;
                }

                _updateView() {
                  this.wrapper.innerHTML = "";
                  const img = document.createElement("img");
                  img.src = this.data.file.url;
                  img.alt = this.data.caption || "";
                  img.className = "max-w-full rounded border";

                  this.wrapper.appendChild(img);
                }

                save() {
                  return this.data;
                }
              },
            },
            marker: Marker,
            inlineCode: InlineCode,
            checklist: Checklist,
            delimiter: Delimiter,
            warning: Warning,
            code: CodeTool,
            underline: Underline,
            embed: Embed,
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: "http://localhost:5000/fetchUrlMeta",
              },
            },
            code: SimpleHR,
            columns: {
              class: Columns,
              config: {
                EditorJsLibrary: EditorJS,
                tools: {
                  header: Header,
                  image: ImageTool,
                  paragraph: {},
                },
              },
            },
          },
        });

        editorRef.current = editor;

        // 🔍 Image tracking
        const handleImg = (img) => {
          const src = img.src;
          if (src && !loggedImages.current.has(src)) {
            imageCountRef.current += 1;
            const index = imageCountRef.current;
            loggedImages.current.add(src);
            if (typeof onImageAdd === "function") {
              onImageAdd({
                src,
                index,
                field: {
                  name: `img${index}`,
                  label: `Image ${index} Slug`,
                  type: "text",
                  value: formData?.[`img${index}`] || "",
                },
              });
            }
          }
        };

        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.querySelectorAll) {
                  const imgs = node.querySelectorAll("img");
                  imgs.forEach(handleImg);
                }
              });
            }
            if (
              mutation.type === "attributes" &&
              mutation.target.tagName === "IMG" &&
              mutation.attributeName === "src"
            ) {
              handleImg(mutation.target);
            }
          }
        });

        if (editorHolderRef.current) {
          observer.observe(editorHolderRef.current, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["src"],
          });
        }

        setInterval(() => {
          const imgs = editorHolderRef.current?.querySelectorAll("img") || [];
          imgs.forEach(handleImg);
        }, 1000);
      } catch (err) {
        console.error("Error initializing EditorJS:", err);
      }
    };

    initEditor();

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="bg-gray-50 p-4 rounded border text-center text-gray-500">
        Loading editor...
      </div>
    );
  }

  return (
    <div
      ref={editorHolderRef}
      className="px-4"
      style={{ minHeight: "400px" }}
    />
  );
});

EditorComponent.displayName = "EditorComponent";
export default EditorComponent;
