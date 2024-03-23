import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchParamsFromURL } from "../common";

const useCommunityFromURL = () => {
  const [id, setId] = useState(null);
  const communities = useSelector((state) => state.getIn(["communities"]));
  const community = (communities || []).find((c) => c.id?.toString() === id) || {};

  useEffect(() => {
    const { comId } = fetchParamsFromURL(window.location, "comId");
    if (comId !== id) setId(comId);
  }, [window.location, communities]);

  return community;
};

export default useCommunityFromURL;
