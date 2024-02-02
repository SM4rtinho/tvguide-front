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
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa";

const divideListIntoChunks = (list, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    chunks.push(list.slice(i, i + chunkSize));
  }
  return chunks;
};
const fetchAllChannels = async () => {
  const result = await axios.get("http://localhost:8081/auth/channels/all");
  console.log("Channels:", result.data);
  return result.data;
};

const addToWatchlist = async (programId) => {
  const response = await axios.post(
    `http://localhost:8081/${programId}/watchlist`,
  );
};

export default function TvProgram(options) {
  const [chunks, setChunks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: channelsData } = useQuery({
    queryKey: "channels",
    queryFn: fetchAllChannels,
    onSuccess: (data) => {},
  });

  useEffect(() => {
    if (channelsData) {
      console.log(divideListIntoChunks(channelsData, 5));
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

const fetchProgramsByChannel = async (channelId) => {
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");
  const result = await axios.get(
    `http://localhost:8081/auth/${channelId}/programs?date=${formattedDate}`,
  );
  return result.data;
};
const ChannelCard = ({ channel }) => {
  const { data: programData } = useQuery({
    queryKey: ["programs", channel.id],
    queryFn: () => fetchProgramsByChannel(channel.id),
    onSuccess: (data) => {},
  });
  const programsData =
    programData &&
    programData.filter((program) =>
      dayjs(new Date(program.endTime)).add(1, "hour").isAfter(dayjs()),
    );
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
  const handleAddToWatchlist = () => {
    addToWatchlist(program.id);
  };

  return (
    <Card shadow="sm" p="lg">
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
      <ActionIcon onClick={handleAddToWatchlist}>
        <FaPlus />
      </ActionIcon>
    </Card>
  );
};
