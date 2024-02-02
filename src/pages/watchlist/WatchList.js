import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Text, Title, Group, Button } from "@mantine/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const ProgramCard = ({ program, onRemove }) => {
  const startTime = dayjs(program.startTime).format("dddd, HH:mm");
  const endTime = dayjs(program.endTime).format("HH:mm");

  return (
    <Card shadow="sm" p="lg" mb="md">
      <Group position="apart" align="center">
        <div>
          <Title order={5}>{program.title}</Title>
          <Text size="sm">
            {program.channel.name} | {startTime} - {endTime}
          </Text>
          <Text size="sm">
            {program.category} | {program.genre}
          </Text>
        </div>
        <Button size="xs" color="red" onClick={() => onRemove(program.id)}>
          Remove
        </Button>
      </Group>
    </Card>
  );
};

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/programs/watchlist",
        );
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist", error);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (programId) => {
    try {
      await axios.delete(`http://localhost:8081/${programId}/watchlist/remove`);
      setWatchlist(watchlist.filter((program) => program.id !== programId));
    } catch (error) {
      console.error("Error removing program from watchlist", error);
    }
  };

  if (!watchlist || watchlist.length === 0) {
    return (
      <Card shadow="sm" padding="lg">
        <Text align="center">Your watchlist is empty.</Text>
      </Card>
    );
  }

  return (
    <div>
      <Title order={2} my="lg" align="center">
        Your Watchlist
      </Title>
      {watchlist.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
};

export default WatchList;
