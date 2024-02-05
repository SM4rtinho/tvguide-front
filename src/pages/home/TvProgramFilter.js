import React, { useState } from "react";
import { Button, Group, SegmentedControl, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

require("dayjs/locale/pl");
dayjs.locale("pl");
function reduceNull(obiekt) {
  return Object.keys(obiekt).reduce((acc, key) => {
    if (obiekt[key] !== null && obiekt[key] !== "") {
      acc[key] = obiekt[key];
    }
    return acc;
  }, {});
}
export const TvProgramFilter = () => {
  const [isFavorite, setIsFavorite] = useState("false");

  let [, setSearchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const params = reduceNull(data);
    setSearchParams(reduceNull(data));
  };

  const NUMBER_OF_DAYS = 7;

  const dates = [];

  for (let i = 0; i < NUMBER_OF_DAYS; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  const changeDayHandle = (date) => {
    setSearchParams({ date: dayjs(date).format("YYYY-MM-DD") });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Group position={"center"} mt={"lg"}>
        {dates.length > 0 &&
          dates.map((date) => (
            <Button variant={"outline"} onClick={() => changeDayHandle(date)}>
              {dayjs(date).format("dddd")}
            </Button>
          ))}
        {/*<TextInput placeholder={"Szukaj"} {...register("title")} />*/}
      </Group>
    </form>
  );
};
