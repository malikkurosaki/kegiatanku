import clientRoutes from "@/clientRoutes";
import { Button, Card, Container, Group, Stack, Title } from "@mantine/core";

export default function Home() {
  return (
    <Container size={420} py={80}>
      <Card shadow="sm" padding="xl" radius="md">
        <Stack gap="md">
          <Title order={2} ta="center">
            Home
          </Title>

          <Group grow>
            <Button size="sm" component="a" href={clientRoutes["/dashboard"]}>
              Dashboard
            </Button>

            <Button
              size="sm"
              component="a"
              href={clientRoutes["/login"]}
              variant="light"
            >
              Login
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
