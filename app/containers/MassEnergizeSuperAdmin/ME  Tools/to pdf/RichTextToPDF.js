import React, { useRef } from "react";
import Html from "react-pdf-html";
import { Page, Text, Document, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
// import html2pdf from "html2pdf.js";

// RichTextToPDF is a functional React component that takes a render prop function, a rich text string,
// an optional style object, and an optional filename string as its props
function RichTextToPDF({ render, richText, style, filename }) {
  return (
    <div>
      <PDFDownloadLink
        document={<JsxToPDF richText={richText} style={style} />}
        fileName={filename}
      >
        {({ loading }) => (loading ? "Loading..." : render())}
      </PDFDownloadLink>
    </div>
  );

}

export default RichTextToPDF;


 function JsxToPDF({ richText, style }) {
  const styles = StyleSheet.create({
    body: {
      textAlign: "justify",
      fontSize: 12,
      lineHeight: 1.5,

      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 40,
    },
    text: {
      fontSize: 13,
      textAlign: "justify",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });
  const stylesheet = {
    li: {
      margin: "5px 30px 5px 0px",
    },
  };
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed />
        <Html style={{ ...styles.text, ...style }} stylesheet={stylesheet}>
          {richText}
        </Html>
        <Text
        fixed
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
