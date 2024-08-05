'use client'

import { generateHTML } from "@tiptap/html";
import React, { useMemo } from "react";
import { defaultExtensions } from "@/lib/default-extensions";
import useLocalStorage from "@/hooks/use-local-storage";

const PreviewPage = () => {
  const [json] = useLocalStorage("novel__content", [{}]); // Default to an empty document if not present

  const output = useMemo(() => {
    try {
      // Log JSON data for debugging
      console.log("JSON Data:", json);

      // Generate HTML from JSON data
      return generateHTML(json, defaultExtensions);
    } catch (error) {
      // Log any errors and return a fallback message
      console.error("Error generating HTML:", error);
      return "<p>Error rendering content</p>";
    }
  }, [json]);

  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: output }}></div>
  );
};

export default PreviewPage;
