import React from "react";
import { TextInput, PasswordInput, Group, Button, Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const editUser = async (data) => {
  return axios
    .put("http://localhost:8081/user/update", data)
    .then(({ data }) => data);
};
export function EditForm() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const editMutation = useMutation(editUser, {
    onSuccess: (e) => {},
  });

  const handleSubmit = (data) => {
    editMutation.mutate(data);
  };

  return (
    <Card>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          {...form.getInputProps("name")}
          label="Nazwa"
          placeholder="ty@email.com"
          required
        />
        <TextInput
          {...form.getInputProps("email")}
          label="Email"
          placeholder="ty@email.com"
          required
        />
        <PasswordInput
          {...form.getInputProps("password")}
          label="Hasło"
          placeholder="Twoje hasło"
          required
          mt="md"
        />
        <Group position="apart" mt="lg"></Group>
        <Button
          loading={editMutation.isLoading}
          type="submit"
          fullWidth
          mt="xl"
        >
          Zmień dane
        </Button>
      </form>
    </Card>
  );
}

export default EditForm;
