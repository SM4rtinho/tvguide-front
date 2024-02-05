import {
  Grid,
  Card,
  Text,
  Image,
  SimpleGrid,
  Stack,
  Group,
  ActionIcon,
  Badge,
  Loader,
  Skeleton,
} from "@mantine/core";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa";
import { TvProgramFilter } from "./TvProgramFilter";
import { TbHeart, TbMinus } from "react-icons/tb";

const divideListIntoChunks = (list, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    chunks.push(list.slice(i, i + chunkSize));
  }
  return chunks;
};
const fetchAllChannels = async () => {
  const result = await axios.get("http://localhost:8081/channels/all", {
    params: {
      isFavorite: true,
    },
  });
  console.log("Channels:", result.data);
  return result.data;
};

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
export default function TvProgram(options) {
  const [chunks, setChunks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: channelsData } = useQuery({
    queryKey: ["channels"],
    queryFn: fetchAllChannels,
    onSuccess: (data) => {},
  });

  useEffect(() => {
    if (channelsData) {
      setChunks(divideListIntoChunks(channelsData, 5));
    }
  }, [channelsData]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((currentPage) => currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < chunks.length - 1) {
      setCurrentPage((currentPage) => currentPage + 1);
    }
  };

  return (
    <>
      <TvProgramFilter />
      <Group position={"apart"}>
        <ActionIcon
          size={"xl"}
          onClick={handlePrevPage}
          variant={"gradient"}
          disabled={currentPage === 0}
        >
          <FaArrowLeft />
        </ActionIcon>
        <ActionIcon
          size={"xl"}
          onClick={handleNextPage}
          variant={"gradient"}
          disabled={currentPage >= chunks.length - 1}
        >
          <FaArrowRight />
        </ActionIcon>
      </Group>
      <SimpleGrid cols={5} spacing="lg">
        {chunks[currentPage] &&
          chunks[currentPage].map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
      </SimpleGrid>
    </>
  );
}

const fetchProgramsByChannel = async ({ queryKey }) => {
  const [_key, { chanelId }, params] = queryKey;

  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");
  const result = await axios.get(`http://localhost:8081/${chanelId}/programs`, {
    params: params,
  });
  return result.data;
};
const ChannelCard = ({ channel }) => {
  let [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);

  const { data: programData } = useQuery({
    queryKey: ["todos", { chanelId: channel.id }, params],
    queryFn: fetchProgramsByChannel,
  });

  const programsData =
    programData &&
    programData.filter((program) =>
      dayjs(new Date(program.endTime)).add(1, "hour").isAfter(dayjs()),
    );
  console.log(programData);
  if (!programsData) {
    return <Skeleton height={300} mb="xl" />;
  }

  return (
    programsData && (
      <Stack>
        <h1>{channel.name}</h1>
        {programsData.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </Stack>
    )
  );
};

const ProgramCard = ({ program }) => {
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
    mutationRemoveFromWatchlist.mutate(program.id);
  };

  const handleAddToWatchlist = () => {
    mutationAddToWatchlist.mutate(program.id);
  };

  const handleLikeProgram = () => {
    mutationLikeProgram.mutate(program.id);
  };

  const handleDislikeProgram = () => {
    mutationDislikeProgram.mutate(program.id);
  };

  return (
    <Card shadow="sm" p="lg">
      <Image src={program.photo} width={"100%"} />
      <Text weight={500}>{program.title}</Text>
      <Text size="sm">
        {/*{program.startTime} - {program.endTime}*/}
        {dayjs(program.startTime).add(1, "hour").format("HH:mm")} -{" "}
        {dayjs(program.endTime).add(1, "hour").format("HH:mm")}
      </Text>
      <Text size="sm">
        {program.category} | {program.genre}
      </Text>
      {dayjs(new Date(program.startTime)).add(1, "hour").isBefore(dayjs()) &&
        dayjs(new Date(program.endTime)).add(1, "hour").isAfter(dayjs()) && (
          <Badge color="red" variant="outline" w={"fit-content"}>
            Live
          </Badge>
        )}
      <Group position={"center"} mt={"lg"}>
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
      </Group>
    </Card>
  );
};
