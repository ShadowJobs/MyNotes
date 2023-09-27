import { safeReq } from "@/utils";
import { request } from "umi";

export const fetchReQuery = async () => {
  const r=safeReq(async()=>{return await request("http://localhost:5000/job/react_query")})
  return r
};

export const fetchPageData = async (page = 0) => {
  const r=safeReq(async()=>{return await request("http://localhost:5000/job/tasks_by_page?page="+page)})
  return r
}