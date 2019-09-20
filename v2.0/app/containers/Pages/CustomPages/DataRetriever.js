import { fetchData } from './../../../utils/messenger'; 

//import { getCommunitiesPageData } from  './../../../api/data/summaryDashboardData';


 async function allCommunities(){
  return await fetchData('v2/communities');
}
 async function immediateEventQuest(community_id){
  return await fetchData(`v2/events?community=${community_id}`);
}
export {
  allCommunities,
  immediateEventQuest
}