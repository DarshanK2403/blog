export function linkifyHtml(html) {
  const urlRegex = /((https?:\/\/)[^\s<>"')]+)/g;
  return html.replace(urlRegex, (url) => {
    return `<a href="${url}" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}
