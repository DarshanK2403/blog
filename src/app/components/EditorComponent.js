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

    // Create actual HR element instead of using innerHTML
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


const EditorComponent = forwardRef((props, ref) => {
  const editorRef = useRef(null);
  const editorHolderRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

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
            header: {
              class: Header,
              inlineToolbar: true,
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            quote: Quote,
            table: Table,
            image: {
              class: ImageTool,
              config: {
                endpoints: {
                  byFile: "http://localhost:5000/uploadFile",
                  byUrl: "http://localhost:5000/fetchUrl",
                },
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
      } catch (error) {
        console.error("Error initializing EditorJS:", error);
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
      <div
        className="bg-gray-50 p-4 rounded border flex items-center justify-center"
        style={{ minHeight: "200px" }}
      >
        <div className="text-gray-500">Loading editor...</div>
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
