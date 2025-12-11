import clientRoutes from "@/clientRoutes";
import {
  Button,
  Card,
  Container,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiFetch from "../lib/apiFetch";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const { data, error, isLoading } = useSWR(
    "/",
    apiFetch["get-allow-register"].get,
  );
  const allowRegister = data?.data?.allowRegister ?? false;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiFetch.auth.register.post({
        name,
        email,
        password,
      });

      if (response.data?.success) {
        window.location.href = clientRoutes["/login"];
        return;
      }

      if (response.error) {
        alert(JSON.stringify(response.error));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await apiFetch.api.user.find.get();
        setIsAuthenticated(res.status === 200);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, []);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  if (isAuthenticated === null) return null;
  if (isAuthenticated)
    return <Navigate to={clientRoutes["/dashboard"]} replace />;

  if (!allowRegister)
    return (
      <Container size={"md"} w={"100%"}>
        <Group justify="center">
          <Stack>
            <Text>Allow register is disabled</Text>
            <Button onClick={() => navigate(clientRoutes["/login"])}>
              Back to login
            </Button>
          </Stack>
        </Group>
      </Container>
    );

  return (
    <Container size={420} py={80}>
      <Card shadow="sm" radius="md" padding="xl">
        <Stack gap="md">
          <Title order={2} ta="center">
            Register
          </Title>

          <TextInput
            label="Name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Group justify="flex-end" mt="sm">
            <Button onClick={handleSubmit} loading={loading} fullWidth>
              Register
            </Button>
          </Group>
          <Text ta="center" size="sm">
            Already have an account? <a href="/login">Login</a>
          </Text>
        </Stack>
      </Card>
    </Container>
  );
}
