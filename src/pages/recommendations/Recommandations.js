import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Text, Title, Group, Button } from "@mantine/core";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const ProgramCard = ({ program, onAddToWatchlist }) => {
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
        <Button size="xs" onClick={() => onAddToWatchlist(program.id)}>
          Add to Watchlist
        </Button>
      </Group>
    </Card>
  );
};

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/recommended-programs",
        );
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommendations", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleAddToWatchlist = async (programId) => {
    try {
      const response = await axios.post(
        `http://localhost:8081/${programId}/watchlist`,
      );
      console.log("Add program to watchlist:", programId);
    } catch (error) {
      console.error("Error adding program to watchlist", error);
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card shadow="sm" padding="lg">
        <Text align="center">There are no recommendations at this time.</Text>
      </Card>
    );
  }

  return (
    <div>
      <Title order={2} my="lg" align="center">
        Recommended for You
      </Title>
      {recommendations.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onAddToWatchlist={handleAddToWatchlist}
        />
      ))}
    </div>
  );
};

export default Recommendations;
