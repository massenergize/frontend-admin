import { getSummaryPageData,getCommunitiesPageData, getTagCollectionsData }
 from './index';

const infoFxnObj = 
[
  {
    title:"Users",
    fxn:getSummaryPageData
  
  },
  {
    title: "Communities", 
    fxn: getCommunitiesPageData, 
  },
  {
    title:"Tag Collections",
    fxn: getTagCollectionsData
  }
];

export default infoFxnObj;