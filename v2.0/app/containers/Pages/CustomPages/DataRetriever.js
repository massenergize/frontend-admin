import { fetchData, formForJokes } from './../../../utils/messenger'; 

const iconTextDefaults = {
  events:{
    title:"Events", 
    desc:"Checkout these upcoming events"
  }, 
  service:{
    title:"Service Providers",
    desc:" See all the community service providers who can help you take action"
  }, 
  actions:{
    title:"Actions", 
    desc:" See actions you can take to add to your community's impact"
  }, 
  testimonials:{
    title:"Testimonials",
    desc:"Not sure about an action or Service Provider? Read these testimonials from other users to learn about their experience"
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
export {
  allCommunities,
  immediateEventQuest,
  immediateGraphQuest,
  formForJokes, 
  iconTextDefaults
}