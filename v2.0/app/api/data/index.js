
import { fetchData} from '../../utils/messenger';

async function getSummaryPageData() {
  return await fetchData('v2/users');
}
async function getCommunitiesPageData() {
  return await fetchData('v2/communities');
} 
async function getTagCollectionsData() {
  return await fetchData('v2/tag-collections');
} 
async function getEventsData() {
  return await fetchData('v2/events?limit=5');
} 
async function getGoalsData() {
  return await fetchData('v2/goals');
} 

async function getTestimonialsData() {
  return await fetchData('v2/testimonials?limit=5');
} 
async function getActionsData() {
  return await fetchData('v2/actions?limit=5');
} 


export {
  getSummaryPageData,
  getCommunitiesPageData,
  getTagCollectionsData,
  getEventsData,
  getGoalsData,
  getTestimonialsData,
  getActionsData
};
