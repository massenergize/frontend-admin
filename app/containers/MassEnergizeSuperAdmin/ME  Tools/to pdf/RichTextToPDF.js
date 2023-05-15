import React, { useRef } from "react";
import html2pdf from "html2pdf.js";


// RichTextToPDF is a functional React component that takes a render prop function, a rich text string,
// an optional style object, and an optional filename string as its props
function RichTextToPDF({ render, richText, style, filename }) {
    // Create a ref to store the DOM node containing the rich text content
    const contentRef = useRef(null);
  
    // Asynchronously download the PDF
    const downloadPDF = async () => {
      // Check if the content ref is not null
      if (contentRef.current === null) {
        console.error("Content reference not found");
        return;
      }
  
      // Convert the Rich Text to a PDF using html2pdf library
      const worker = html2pdf()
        .from(contentRef.current) // Use the content ref as the source
        .set({
          margin: 0, // Set the margin to 0
          // Set the filename of the downloaded PDF to the provided filename or use a default value
          filename: filename || "download.pdf",
          image: { type: "jpeg", quality: 1 }, // Set the image format and quality
          html2canvas: { scale: 2 }, // Set the scale factor for html2canvas
          jsPDF: { unit: "pt", format: "letter", orientation: "portrait" }, // Set jsPDF options such as unit, format, and orientation
        });
  
      // Save the PDF
      await worker.save();
    };
  
    // Return the component's JSX
    return (
      <div style={style || {}}>
        {/* Invoke the render prop function, passing in the downloadPDF function */}
        {render && render(downloadPDF)}
        {/* Hide the rich text content from view by wrapping it in a div with display set to 'none' */}
        <div style={{ display: "none" }}>
          {/* Set the rich text content using dangerouslySetInnerHTML and the content ref */}
          <div
            dangerouslySetInnerHTML={{ __html: richText }}
            ref={contentRef}
            style={{
              padding: "80px 40px",
            }}
          />
        </div>
      </div>
    );
  }
  

export default RichTextToPDF;
