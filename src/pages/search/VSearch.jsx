import {
  Card,
  Image,
  Avatar,
  Text,
  Group,
  SimpleGrid,
  Badge,
  Stack,
} from "@mantine/core";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { SearchPrograms } from "./SearchPrograms";
import { VSearchFilter } from "./VSearchFilter";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";

const getPrograms = async ({ queryKey }) => {
  const [_key, params] = queryKey;

  return axios
    .get("http://localhost:8081/programs/filter", {
      params,
    })
    .then(({ data }) => data);
};

const VSearch = () => {
  let [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);

  const { data } = useQuery({
    queryKey: ["programs", params],
    queryFn: getPrograms,
  });
  if (!data) return null;

  return (
    <Stack spacing={"md"} p={"lg"}>
      <VSearchFilter />
      <SearchPrograms content={data} />
      <Pagination totalPages={data.totalPages} />
    </Stack>
  );
};

export default VSearch;
