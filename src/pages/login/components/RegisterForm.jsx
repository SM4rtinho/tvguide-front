import React from 'react';
import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api/ApiServices";
import {Link, useNavigate} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

export function RegisterForm() {
    const navigate  = useNavigate();
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const registerMutation = useMutation(api.register, {
        onSuccess: (e) => {
            navigate("/login")
        }
    });

    const handleSubmit = data => {
        registerMutation.mutate(data);
    };

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Create an account
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Already have an account?{' '}
                <Link to={"/login"}>
                    <Anchor size="sm" component="button">
                        Sign in
                    </Anchor>
                </Link>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput {...form.getInputProps('name')} label="Name" placeholder="you@mantine.dev" required />
                    <TextInput {...form.getInputProps('email')} label="Email" placeholder="you@mantine.dev" required />
                    <PasswordInput {...form.getInputProps('password')} label="Password" placeholder="Your password" required mt="md" />
                    <Group position="apart" mt="lg">

                    </Group>
                    <Button loading={registerMutation.isLoading} type="submit" fullWidth mt="xl">
                        Register
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default RegisterForm;