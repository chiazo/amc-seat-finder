import {
  AMC_API_KEY,
  SANDBOX_URL,
  DEFAULT_HEADERS,
  getLocationPath,
  getQueryParamString,
} from "./constants.js";

const base = `${SANDBOX_URL}${getLocationPath("NY")}`;
const queryParams = getQueryParamString(1, 10, "");
const path = queryParams.length > 0 ? `${base}?${queryParams}` : base;

const fetchData = () => {
  console.log(path);
  defaultReq();
};

const defaultReq = () => handleRequest(path, "GET", DEFAULT_HEADERS, {});

const handleRequest = async (path, method, headers, body) => {
  const req = {
    method: method,
    headers: headers,
    ...(method == "POST" && { body: JSON.stringify(body) }),
  };

  const res = await fetch(path, req);
  const data = await res.json();
  console.log(data);
  return data;
};

fetchData();
