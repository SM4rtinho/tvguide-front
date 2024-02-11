import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Text,
  Title,
  Group,
  Button,
  Image,
  Stack,
  Badge,
  ActionIcon,
} from "@mantine/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { TbHeart, TbMinus } from "react-icons/tb";

dayjs.extend(localizedFormat);

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

const ProgramCard = ({ program, onRemove }) => {
  const startTime = dayjs(program.startTime).format("dddd, HH:mm");
  const endTime = dayjs(program.endTime).format("HH:mm");

  const queryClient = useQueryClient();

  const mutationAddToWatchlist = useMutation(addToWatchlist, {
    onSuccess: () => {
      queryClient.invalidateQueries("watchlist");
    },
  });

  const mutationRemoveFromWatchlist = useMutation(removeFromWatchlist, {
    onSuccess: () => {
      queryClient.invalidateQueries("recommended");
    },
  });

  const mutationLikeProgram = useMutation(likeProgram, {
    onSuccess: () => {
      queryClient.invalidateQueries("recommended");
    },
  });

  const mutationDislikeProgram = useMutation(dislikeProgram, {
    onSuccess: () => {
      queryClient.invalidateQueries("recommended");
    },
  });

  const handleAddToWatchlist = () => {
    mutationAddToWatchlist.mutate(program.id);
  };

  const handleRemoveFromWatchlist = () => {
    mutationRemoveFromWatchlist.mutate(program.id);
  };

  const handleLikeProgram = () => {
    mutationLikeProgram.mutate(program.id);
  };

  const handleDislikeProgram = () => {
    mutationDislikeProgram.mutate(program.id);
  };
  return (
    <Card withBorder radius="md" p={0}>
      <Group noWrap gap={0}>
        <Image src={program.photo} height={160} maw={250} />
        <Stack>
          <Text tt="uppercase" c="dimmed" fw={700} size="xs">
            {program.genre}
          </Text>
          <Text mt="xs" mb="md">
            {program.title} ( {program.productionYear} )
          </Text>

          <Group gap="xs">
            <Group gap="xs" wrap="nowrap">
              <Badge size="xs">{program.channel.name}</Badge>
            </Group>
            <Text size="xs" c="dimmed">
              {dayjs(program.startTime).format("dddd HH:mm")}
            </Text>
          </Group>
        </Stack>
        <Group position={"center"}>
          {!program.isOnWatchlist ? (
            <ActionIcon onClick={handleAddToWatchlist}>
              <FaPlus />
            </ActionIcon>
          ) : (
            <ActionIcon onClick={handleRemoveFromWatchlist}>
              <TbMinus />
            </ActionIcon>
          )}
          <ActionIcon
            color={program.isLiked ? "red" : "gray"}
            onClick={program.isLiked ? handleDislikeProgram : handleLikeProgram}
            variant={program.isLiked ? "filled" : "outline"}
          >
            <TbHeart />
          </ActionIcon>
          <Badge color={"gray"}>{program.numberOfLikes.toString()}</Badge>
        </Group>
      </Group>
    </Card>
  );
};

const getRecommended = async () => {
  const response = await axios.get(
    "http://localhost:8081/recommended-programs",
  );
  return response.data;
};

const Recommended = () => {
  // const [recommended, setWatchlist] = useState([]);
  //
  // useEffect(() => {
  //   const fetchWatchlist = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8081/programs/watchlist",
  //       );
  //       setWatchlist(response.data);
  //     } catch (error) {
  //       console.error("Error fetching recommended", error);
  //     }
  //   };
  //
  //   fetchWatchlist();
  // }, []);

  const queryClient = useQueryClient();
  const { data: recommended } = useQuery({
    queryKey: "recommended",
    queryFn: getRecommended,
  });

  const handleRemove = async (programId) => {
    try {
      await axios.delete(`http://localhost:8081/watchlist/${programId}/remove`);
      queryClient.invalidateQueries("recommended");
    } catch (error) {
      console.error("Error removing program from recommended", error);
    }
  };

  if (!recommended || recommended.length === 0) {
    return (
      <Card shadow="sm" padding="lg">
        <Text align="center">No recommendations at this time.</Text>
      </Card>
    );
  }

  return (
    <div>
      <Title order={2} my="lg" align="center">
        Rekomendowane programy
      </Title>
      {recommended.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
};

export default Recommended;
