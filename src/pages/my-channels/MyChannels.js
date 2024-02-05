import React from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import { TbMinus, TbPlus } from "react-icons/tb";

const getChannels = async () => {
  return axios
    .get("http://localhost:8081/channels/all")
    .then(({ data }) => data);
};

const addChannelToFavorites = async (channelId) => {
  return axios
    .post(`http://localhost:8081/favorite-channels/${channelId}/add`)
    .then(({ data }) => data);
};

const removeChannelFromFavorites = async (channelId) => {
  return axios
    .delete(`http://localhost:8081/favorite-channels/${channelId}/remove`)
    .then(({ data }) => data);
};
const MyChannels = () => {
  const { data, refetch } = useQuery({
    queryKey: "channels",
    queryFn: getChannels,
  });

  const onSuccessfulUpdate = () => {
    refetch();
  };

  const addToFavoritesMutation = useMutation(addChannelToFavorites, {
    onSuccess: onSuccessfulUpdate,
  });

  const removeFromFavoritesMutation = useMutation(removeChannelFromFavorites, {
    onSuccess: onSuccessfulUpdate,
  });

  return (
    <SimpleGrid cols={3} spacing="lg">
      {data?.map((channel) => (
        <Card shadow={"lg"} key={channel.id}>
          <Stack h={"100%"}>
            <h3>{channel.name}</h3>
            {channel.isFavorite ? (
              <Button
                mt={"auto"}
                variant={"light"}
                color="red"
                onClick={() => {
                  removeFromFavoritesMutation.mutate(channel.id);
                }}
                loading={removeFromFavoritesMutation.isLoading}
              >
                Usuń z moich kanałów
              </Button>
            ) : (
              <Button
                mt={"auto"}
                variant={"light"}
                color="green"
                onClick={() => {
                  addToFavoritesMutation.mutate(channel.id);
                }}
                loading={addToFavoritesMutation.isLoading}
              >
                Dodaj do moich kanałów
              </Button>
            )}
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default MyChannels;
