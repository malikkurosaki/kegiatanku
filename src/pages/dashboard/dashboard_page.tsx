import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";

export default function Dashboard() {
  return (
    <Container>
      <Stack gap="lg">
        {/* -------- STATS SECTION -------- */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md">
            <Text size="sm" c="dimmed">
              Total Users
            </Text>
            <Title order={3}>1,234</Title>
          </Card>

          <Card shadow="sm" padding="lg" radius="md">
            <Text size="sm" c="dimmed">
              Active Sessions
            </Text>
            <Title order={3}>87</Title>
          </Card>

          <Card shadow="sm" padding="lg" radius="md">
            <Text size="sm" c="dimmed">
              API Calls today
            </Text>
            <Title order={3}>12,490</Title>
          </Card>

          <Card shadow="sm" padding="lg" radius="md">
            <Text size="sm" c="dimmed">
              Errors
            </Text>
            <Title order={3}>5</Title>
          </Card>
        </SimpleGrid>

        {/* -------- QUICK ACTIONS -------- */}
        <Card shadow="sm" radius="md" padding="lg">
          <Group justify="space-between" mb="sm">
            <Title order={4}>Quick Actions</Title>
          </Group>

          <Group>
            <Button>Add API Key</Button>
            <Button variant="outline">Manage Users</Button>
            <Button variant="light">View Logs</Button>
          </Group>
        </Card>

        {/* -------- ACTIVITY TABLE -------- */}
        <Card shadow="sm" radius="md" padding="lg">
          <Stack gap="md">
            <Title order={4}>Recent Activity</Title>
            <Divider />

            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Action</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>John Doe</Table.Td>
                  <Table.Td>Generated new API key</Table.Td>
                  <Table.Td>2025-01-21</Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="light" color="green">
                      Success
                    </Button>
                  </Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Td>Ana Smith</Table.Td>
                  <Table.Td>Deleted session</Table.Td>
                  <Table.Td>2025-01-20</Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="light" color="blue">
                      Info
                    </Button>
                  </Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Td>Michael</Table.Td>
                  <Table.Td>Failed login attempt</Table.Td>
                  <Table.Td>2025-01-19</Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="light" color="red">
                      Error
                    </Button>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
