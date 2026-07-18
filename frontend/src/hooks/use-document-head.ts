import { useEffect } from "react";

type MetaTag = { name?: string; property?: string; content: string };

/**
 * Sets the document title and meta tags for the current page, restoring the
 * previous values on unmount. This replaces TanStack Start's SSR-only head
 * management (HeadContent/Scripts/head()), since this app now renders purely
 * on the client as a standard Vite SPA.
 */
export function useDocumentHead(title: string, meta: MetaTag[] = []) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const restoreFns: Array<() => void> = [];

    for (const { name, property, content } of meta) {
      const attr = name ? "name" : "property";
      const key = name ?? property;
      if (!key) continue;

      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }

      const previousContent = el.getAttribute("content");
      el.setAttribute("content", content);

      restoreFns.push(() => {
        if (created) {
          el?.remove();
        } else if (previousContent !== null) {
          el?.setAttribute("content", previousContent);
        }
      });
    }

    return () => {
      document.title = previousTitle;
      restoreFns.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, JSON.stringify(meta)]);
}
