import React from 'react'
import AsyncSelect from '../../../../utils/components/AsyncSelect/AsyncSelect';
import { customFilterListOptions } from './utils';

export default function CustomOptions({ data , label, endpoint, customBodyRender}) {
   return {
     filter: true,
     filterType: "custom",
     display: "true",
     customBodyRender,
     customFilterListOptions: customFilterListOptions,
     filterOptions: {
       logic: (location, filters, row) => {
        console.log("=== location ===", location);
        console.log("=== filters ===", filters);
         if (filters.length) return !filters.includes(location);
         return false;
       },
       display: (filterList, onChange, index, column) => {
         let items = (data || [])?.map((c) => c?.name && c?.name);
         return (
           <AsyncSelect
             onChange={onChange}
             items={items}
             column={column}
             index={index}
             filterList={filterList}
             label={label}
             endpoint={endpoint}
             prepData={(newData, existing) => {
               if (typeof newData[0] !== "object") return newData;
               let data = newData.map((c) => c.name);
               const uniqueItems = [...new Set([...existing, ...data])];
               return uniqueItems;
             }}
           />
         );
       },
     },
   };
}
