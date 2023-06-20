import { Checkbox, Chip, FormControlLabel } from "@mui/material";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { pop } from "../../../../utils/common";
import { apiCall } from "../../../../utils/messenger";

function MEDropdownPro({
  onHeaderRender,
  labelExtractor,
  valueExtractor,
  onItemSelected,
  multiple,
  data,
  placeholder,
  defaultValue,
  value,
  ...rest
}) {
     const [selected, setSelected] = useState(defaultValue || value || []);
     const [show, setShow] = useState(false);
      const [cursor, setCursor] = React.useState({ has_more: true, next: 1 });
      const [optionsToDisplay, setOptionsToDisplay] = useState(data || []);

     // -------------------------------------------------------------------
     const elementObserver = useRef(null);
     const lastDropDownItemRef = useCallback(
       (node) => {
         if (elementObserver.current) elementObserver.current.disconnect();
         elementObserver.current = new IntersectionObserver((entries) => {
           if (entries[0].isIntersecting && cursor.has_more) {
             if (!rest?.endpoint) return;
             apiCall(rest?.endpoint, { page: cursor.next, limit: 10 }).then(
               (res) => {
                 setCursor({
                   has_more: res?.cursor?.count > optionsToDisplay?.length,
                   next: res?.cursor?.next,
                 });
                 let items = [
                   ...optionsToDisplay,
                   ...(res?.data || [])?.map((item) => {
                     return {
                       ...item,
                       displayName: labelExtractor
                         ? labelExtractor(item)
                         : item?.name || item?.title,
                     };
                   }),
                 ];

                 setOptionsToDisplay([
                   ...new Map(
                     items.map((item) => [item["id"], item])
                   ).values(),
                 ]);
               }
             );
           }
         });

         if (node) elementObserver.current.observe(node);
       },
       [cursor]
     );
     // -------------------------------------------------------------------

     useEffect(() => {
       setSelected(defaultValue || value || []);
     }, [defaultValue, value]);

     const labelOf = (item, getItemFromValue) => {
       if (!item) return;
       if (getItemFromValue) {
         item = (optionsToDisplay || []).find((it) => valueOf(it) === item);
       }
       if (labelExtractor) return labelExtractor(item);
       return (item && item.name) || (item && item.toString());
     };

     const valueOf = (item) => {
       if (!item) return;
       if (valueExtractor) return valueExtractor(item);
       return (item && item.name) || (item && item.toString());
     };
     const renderHeader = () => {
       let items = selected?.map((itm) => labelOf(itm, true));
       if (onHeaderRender) return onHeaderRender(items, selected);
       if (!items?.length) return placeholder || "Select an item";
       return items?.join(",");
     };

     const handleOnChange = (item) => {
       var items;
       if (!multiple) {
         items = [valueOf(item)];
         if (onItemSelected) onItemSelected(items);
         setShow(false);
         return setSelected(items);
       }
       const [found, rest] = pop(selected, valueOf(item));
       if (found) items = rest;
       else items = [...rest, valueOf(item)];
       setSelected(items);
       if (onItemSelected) return onItemSelected(items);
     };

     const itemIsSelected = (item) => {
       const found = (selected || []).find(
         (it) => it.toString() === item.toString()
       );
       return found;
     };

     const renderChildren = () => {
       if (!show) return <></>;
       return optionsToDisplay?.map((d, i) => {
         return (
           <p
           ref={(i === optionsToDisplay.length - 1) && rest?.isAsync ? lastDropDownItemRef:null}
             key={i}
             onClick={() => handleOnChange(d)}
             className="drop-pro-child"
             style={multiple ? { padding: "13px" } : {}}
           >
             {multiple && (
               <Checkbox
                 checked={itemIsSelected(valueOf(d))}
                 value={valueOf(d)}
                 name={labelOf(d)}
               />
             )}
             {labelOf(d)}
           </p>
         );
       });
     };

     return (
       <div style={{ position: "relative", display: "inline-block" }}>
         <div className="drop-pro-trigger" onClick={() => setShow(!show)}>
           {renderHeader()}
           <i className="fa fa-caret-down" style={{ marginLeft: 10 }} />
         </div>
         {show && (
           <div
             className="drop-ghost-curtain"
             onClick={() => setShow(false)}
           />
         )}
         {show && (
           <div className="drop-children-area">{renderChildren()}</div>
         )}
       </div>
     );
   }

export default MEDropdownPro;
