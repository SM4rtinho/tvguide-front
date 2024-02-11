import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/ApiServices";
import { useAuth } from "../../../context/AuthContext";

import { Link, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useMutation(api.login, {
    onSuccess: (e) => {
      login(e.data.token);
    },
  });

  const handleSubmit = (data) => {
    loginMutation.mutate(data);
  };
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Witaj z powrotem!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Nie masz jeszcze konta?{" "}
        <Link to={"/register"}>
          <Anchor size="sm" component="button">
            Załóż konto
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
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
            loading={loginMutation.isLoading}
            type={"submit"}
            fullWidth
            mt="xl"
          >
            Zaloguj się
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm;
