import React from "react";
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import { FaPlus } from "react-icons/fa";
import { TbHeart, TbMinus } from "react-icons/tb";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addToWatchlist = async (programId) => {
  const response = await axios.post(
    `http://localhost:8081/programs/${programId}/watchlist`,
  );
};

const removeFromWatchlist = async (programId) => {
  const response = await axios.delete(
    `http://localhost:8081/watchlist/${programId}/remove`,
  );
};

const likeProgram = async (programId) => {
  const response = await axios.post(
    `http://localhost:8081/programs/${programId}/like`,
  );
};

const dislikeProgram = async (programId) => {
  const response = await axios.post(
    `http://localhost:8081/programs/${programId}/dislike`,
  );
};

export const SearchPrograms = ({ content }) => {
  if (content.content.length === 0)
    return <Text color={"gray"}>No results</Text>;
  return (
    <SimpleGrid
      breakpoints={[{ minWidth: "sm", cols: 2, spacing: "md" }]}
      cols={1}
      gap={10}
    >
      {content.content.map((data) => (
        <ProgramCard
          id={data.id}
          title={data.title}
          channelName={data.channel.name}
          genre={data.genre}
          startTime={data.startTime}
          photo={data.photo}
          productionYear={data.productionYear}
          isOnWatchlist={data.isOnWatchlist}
          isLiked={data.isLiked}
        />
      ))}
    </SimpleGrid>
  );
};

const ProgramCard = ({
  id,
  title,
  channelName,
  genre,
  startTime,
  photo,
  productionYear,
  isOnWatchlist,
  isLiked,
}) => {
  const queryClient = useQueryClient();
  const mutationAddToWatchlist = useMutation(addToWatchlist, {
    onSuccess: () => {
      queryClient.invalidateQueries("watchlist");
    },
  });

  const mutationRemoveFromWatchlist = useMutation(removeFromWatchlist, {
    onSuccess: () => {
      queryClient.invalidateQueries("watchlist");
    },
  });

  const mutationLikeProgram = useMutation(likeProgram, {
    onSuccess: () => {
      queryClient.invalidateQueries("watchlist");
    },
  });

  const mutationDislikeProgram = useMutation(dislikeProgram, {
    onSuccess: () => {
      queryClient.invalidateQueries("watchlist");
    },
  });

  const handleRemoveFromWatchlist = () => {
    mutationRemoveFromWatchlist.mutate(id);
  };

  const handleAddToWatchlist = () => {
    mutationAddToWatchlist.mutate(id);
  };

  const handleLikeProgram = () => {
    mutationLikeProgram.mutate(id);
  };

  const handleDislikeProgram = () => {
    mutationDislikeProgram.mutate(id);
  };
  return (
    <Card withBorder radius="md" p={0}>
      <Group noWrap gap={0}>
        <Image src={photo} height={160} maw={250} />
        <Stack>
          <Text tt="uppercase" c="dimmed" fw={700} size="xs">
            {genre}
          </Text>
          <Text mt="xs" mb="md">
            {title} ( {productionYear} )
          </Text>

          <Group gap="xs">
            <Group gap="xs" wrap="nowrap">
              <Badge size="xs">{channelName}</Badge>
            </Group>
            <Text size="xs" c="dimmed">
              {dayjs(startTime).format("dddd HH:mm")}
            </Text>
          </Group>
        </Stack>
        <Group position={"center"}>
          {!isOnWatchlist ? (
            <ActionIcon onClick={handleAddToWatchlist}>
              <FaPlus />
            </ActionIcon>
          ) : (
            <ActionIcon onClick={handleRemoveFromWatchlist}>
              <TbMinus />
            </ActionIcon>
          )}
          <ActionIcon
            color={isLiked ? "red" : "gray"}
            onClick={isLiked ? handleDislikeProgram : handleLikeProgram}
            variant={isLiked ? "filled" : "outline"}
          >
            <TbHeart />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
};
