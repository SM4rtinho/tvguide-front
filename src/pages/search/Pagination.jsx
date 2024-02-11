import React, { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { Pagination as MantinePagination } from "@mantine/core";

const Pagination = ({ totalPages }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setPage] = useState(searchParams.get("page") || 1);

  const handlePageChange = (page) => {
    let params = Object.fromEntries([...searchParams]);
    setSearchParams({ ...params, page: page });
    setPage(page);
  };

  useEffect(() => {
    setPage(searchParams.get("page") || 1);
  }, [searchParams]);

  return (
    <MantinePagination
      value={Number(activePage)}
      onChange={handlePageChange}
      total={totalPages}
    />
  );
};

export default Pagination;
