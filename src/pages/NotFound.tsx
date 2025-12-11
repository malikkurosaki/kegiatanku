import { Anchor, Container, Text } from "@mantine/core";

export default function NotFound() {
  return (
    <Container>
      <Text size="xl" ta="center" mb="md">
        404 Not Found
      </Text>
      <Text ta="center" mb="lg">
        The page you are looking for does not exist.
      </Text>
      <Text ta="center">
        <Anchor href="/" c="blue" underline="hover">
          Go back home
        </Anchor>
      </Text>
    </Container>
  );
}
