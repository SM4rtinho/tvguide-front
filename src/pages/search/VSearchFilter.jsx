import React from "react";
import { Button, Group, Select, TextInput } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function reduceNull(obiekt) {
  return Object.keys(obiekt).reduce((acc, key) => {
    if (obiekt[key] !== null && obiekt[key] !== "") {
      acc[key] = obiekt[key];
    }
    return acc;
  }, {});
}

const returnChannelsToSelect = (channels) => {
  if (!channels) return [];
  return channels.map((channel) => {
    return {
      value: channel.id.toString(),
      label: channel.name,
    };
  });
};

const getAllChannels = async () => {
  return axios
    .get("http://localhost:8081/channels/all")
    .then(({ data }) => data);
};
const getAllCategories = async () => {
  return axios
    .get("http://localhost:8081/programs/categories")
    .then(({ data }) => data);
};

const getAllGenres = async () => {
  return axios
    .get("http://localhost:8081/programs/genres")
    .then(({ data }) => data);
};
const getAllThematicCategories = async () => {
  return axios
    .get("http://localhost:8081/programs/thematic-categories")
    .then(({ data }) => data);
};

export const VSearchFilter = () => {
  const { data: channels } = useQuery({
    queryKey: "channels",
    queryFn: getAllChannels,
  });

  const { data: categories } = useQuery({
    queryKey: "categories",
    queryFn: getAllCategories,
  });

  const { data: genres } = useQuery({
    queryKey: "genres",
    queryFn: getAllGenres,
  });
  const { data: thematicCategories } = useQuery({
    queryKey: "thematicCategories",
    queryFn: getAllThematicCategories,
  });

  let [, setSearchParams] = useSearchParams();

  const {
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const params = reduceNull(data);
    setSearchParams(params);
  };

  const allChannels = returnChannelsToSelect(channels);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group noWrap>
          <TextInput w={"100%"} placeholder="Search" {...register("title")} />
          <Select
            placeholder={"Select channel"}
            data={allChannels}
            onChange={(value) => {
              setValue("channelIds", value.toString());
            }}
          />
          <Select
            placeholder={"Select category"}
            data={
              categories
                ? categories?.map((category) => {
                    return { value: category, label: category };
                  })
                : []
            }
            onChange={(value) => {
              setValue("category", value.toString());
            }}
          />

          <Select
            placeholder={"Select genre"}
            data={
              genres
                ? genres.map((genre) => {
                    return { value: genre, label: genre };
                  })
                : []
            }
            onChange={(value) => {
              setValue("genre", value.toString());
            }}
          />
          <Button type={"submit"} w={"fit"} variant="light">
            Search
          </Button>
        </Group>
      </form>
    </>
  );
};
