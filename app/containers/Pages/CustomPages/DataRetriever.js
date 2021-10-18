import { fetchData, formForJokes, apiCall } from './../../../utils/messenger'; 

const iconTextDefaults = {
  events:{
    title:"Events", 
    desc:"Checkout these upcoming events"
  }, 
  service:{
    title:"Service Providers",
    desc:"See all the community service providers"
  }, 
  actions:{
    title:"Actions", 
    desc:"See sustainable actions you can take"
  }, 
  testimonials:{
    title:"Testimonials",
    desc:"Read these testimonials from other users"
  }
}

 async function allCommunities(){
  return await fetchData('v2/communities');
}
 async function immediateEventQuest(community_id){
  return await fetchData(`v2/events?community=${community_id}`);
}
 async function immediateGraphQuest(community_id){
  return await fetchData(`v2/data?community=${community_id}`);
}

async function v3AllCommunities(){
  return await apiCall('/communities.list');
}
export {
  allCommunities,
  immediateEventQuest,
  immediateGraphQuest,
  formForJokes, 
  iconTextDefaults, 
  v3AllCommunities,
}