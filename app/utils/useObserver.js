import React,{ useRef, useState, useCallback, useEffect } from "react";
import { apiCall } from "./messenger";
const useObserver = (options) => {
  const [cursor, setCursor] = React.useState({ has_more: true, next: 1 });
  const [data, setData] = useState(options?.data || []);
  const observerRef = useRef(null);


  useEffect(() => {
    if(options?.params?.search_text){
      setCursor({ has_more: true, next: 1 });
    }
  }, [options?.params?.search_text]);


   const lastItemRef = useCallback(
     (node) => {
       if (observerRef.current) observerRef.current.disconnect();
       observerRef.current = new IntersectionObserver((entries) => {
         if (entries[0].isIntersecting && cursor.has_more) {
           if (!options?.endpoint) return;
           apiCall(options?.endpoint, {
             page: cursor.next,
             limit: 10,
           ...(options?.args||{}) ,
             params: JSON.stringify({...(options?.params||{})}),
           }).then((res) => {
             setCursor({
               has_more: res?.cursor?.count > options?.data?.length,
               next: res?.cursor?.next,
             });
             setData(res?.data);
           });
         }
       });

       if (node) observerRef.current.observe(node);
     },
     [cursor]
   );
   return {
     ref: lastItemRef,
     data,
     cursor,
   };
};

export default useObserver;