import apiFetch from "@/lib/apiFetch";
import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import useSwr from "swr";

export default function ApiKeyPage() {
  return (
    <Container size="md" w="100%" py="lg">
      <Stack gap="lg">
        <Title order={2}>API Key Management</Title>
        <CreateApiKey />
        <ListApiKey />
      </Stack>
    </Container>
  );
}

function CreateApiKey() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expiredAt, setExpiredAt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!name || !description) {
        showNotification({
          title: "Error",
          message: "All fields are required",
          color: "red",
        });
        return;
      }

      const res = await apiFetch.api.apikey.create.post({
        name,
        description,
        expiredAt: expiredAt
          ? new Date(expiredAt).toISOString()
          : new Date().toISOString(),
      });

      if (res.status === 200) {
        setName("");
        setDescription("");
        setExpiredAt("");

        showNotification({
          title: "Success",
          message: "API key created successfully",
          color: "green",
        });
      }

      setLoading(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to create API key " + JSON.stringify(error),
        color: "red",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" radius="md" padding="lg">
      <Stack gap="md">
        <Title order={4}>Create API Key</Title>

        <TextInput
          label="Name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextInput
          label="Description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextInput
          label="Expired At"
          placeholder="Expired At"
          type="date"
          value={expiredAt}
          onChange={(e) => setExpiredAt(e.target.value)}
        />

        <Group justify="flex-end" mt="sm">
          <Button
            variant="outline"
            onClick={() => {
              setName("");
              setDescription("");
              setExpiredAt("");
            }}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} type="submit" loading={loading}>
            Save
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

function ListApiKey() {
  const { data, error, isLoading, mutate } = useSwr(
    "/",
    () => apiFetch.api.apikey.list.get(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshInterval: 3000,
    },
  );
  const apiKeys = data?.data?.apiKeys || [];

  useEffect(() => {
    mutate();
  }, []);

  if (error) return <Text color="red">Error fetching API keys</Text>;
  if (isLoading) return <Loader />;

  return (
    <Card shadow="sm" radius="md" padding="lg">
      <Stack gap="md">
        <Title order={4}>API Key List</Title>

        <Divider />

        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Expired At</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th style={{ width: 160 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {apiKeys.map((apiKey: any, index: number) => (
              <Table.Tr key={index}>
                <Table.Td>{apiKey.name}</Table.Td>
                <Table.Td>{apiKey.description}</Table.Td>
                <Table.Td>
                  {apiKey.expiredAt?.toISOString().split("T")[0]}
                </Table.Td>
                <Table.Td>
                  {apiKey.createdAt?.toISOString().split("T")[0]}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => {
                        modals.openConfirmModal({
                          title: "Delete API Key",
                          children: (
                            <Text>
                              Are you sure you want to delete this API key?
                            </Text>
                          ),
                          labels: { confirm: "Delete", cancel: "Cancel" },
                          onCancel: () => {},
                          onConfirm: async () => {
                            await apiFetch.api.apikey.delete.delete({
                              id: apiKey.id,
                            });
                            mutate();
                          },
                        });
                      }}
                    >
                      Delete
                    </Button>

                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey.key);
                        showNotification({
                          title: "Copied",
                          message: "API key copied to clipboard",
                          color: "green",
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );
}
