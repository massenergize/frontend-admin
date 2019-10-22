



export default function reducer(state = null, action) {
  switch (action.type) {
    case "LOAD_AUTHENTICATED_USER":
      return action.payload
    
    default:
      return state;
  }
}
