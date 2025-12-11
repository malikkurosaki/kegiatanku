import clientRoutes from "@/clientRoutes";
import apiFetch from "@/lib/apiFetch";
import {
  ActionIcon,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Loader,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEye } from "@tabler/icons-react";
import type { Configs, User } from "generated/prisma";
import { useState } from "react";
import { useNavigate } from "react-router";
import useSwr from "swr";

export default function JadwalShalat() {
  return (
    <Container size="md" w={"100%"}>
      <Stack>
        <ListUser />
        {/* <ConfigView /> */}
        <ConfigUpdate />
      </Stack>
    </Container>
  );
}

function ListUser() {
  const { data, error, isLoading, mutate } = useSwr(
    "/",
    apiFetch.api["jadwal-sholat"]["user-list"].get,
  );
  const [listUser, setListUser] = useState<User[]>([]);
  const navigate = useNavigate();
  useShallowEffect(() => {
    setListUser(data?.data?.data ?? []);
  }, [data]);
  if (isLoading) return <Loader />;
  if (error) return <Text>{error.message}</Text>;

  return (
    <Stack>
      <Group justify="end">
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={() => navigate(clientRoutes["/shalat/shalat"])}
        >
          <IconEye />
        </ActionIcon>
      </Group>
      <Card>
        <Stack>
          <Title order={4}>List User</Title>
          {listUser.map((user) => (
            <Stack key={user.id}>
              <Flex>
                <Text w={200}>{user.name}</Text>
                <Switch
                  defaultChecked={user.active}
                  onChange={async (e) => {
                    const { data } = await apiFetch.api["jadwal-sholat-admin"][
                      "user-active"
                    ].put({ id: user.id, active: e.target.checked });
                    mutate();
                  }}
                />
              </Flex>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

function ConfigView() {
  const { data, error, isLoading, mutate } = useSwr(
    "/apa",
    apiFetch.api["jadwal-sholat"]["config"].get,
  );
  const [config, setConfig] = useState<any>(null);
  useShallowEffect(() => {
    setConfig(data?.data?.data ?? null);
    // console.log(data?.data?.data);
  }, [data]);

  if (isLoading) return <Loader />;
  if (error) return <Text>{error.message}</Text>;

  return (
    <Card>
      <Stack>
        <Title order={4}>Config</Title>
        <Flex>
          <Text w={200}>Imam Key</Text>
          <Text>{config?.imamKey}</Text>
        </Flex>
        <Flex>
          <Text w={200}>Ikomah Key</Text>
          <Text>{config?.ikomahKey}</Text>
        </Flex>
      </Stack>
    </Card>
  );
}

function ConfigUpdate() {
  const { data, error, isLoading, mutate } = useSwr(
    "/apa",
    apiFetch.api["jadwal-sholat"]["config"].get,
  );
  const [config, setConfig] = useState<Partial<Configs> | null>(null);
  useShallowEffect(() => {
    setConfig(data?.data?.data ?? null);
  }, [data]);

  async function handleUpdate() {
    if (!config?.ikomahKey || !config?.imamKey)
      return notifications.show({
        title: "Error",
        message: "Config updated failed",
        color: "red",
      });
    const { data, status } = await apiFetch.api["jadwal-sholat-admin"][
      "config"
    ].put({
      id: "1",
      ikomahKey: config.ikomahKey,
      imamKey: config.imamKey,
    });

    if (status === 200) {
      notifications.show({
        title: "Success",
        message: "Config updated successfully",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Error",
        message: "Config updated failed",
        color: "red",
      });
    }
  }

  if (isLoading) return <Loader />;
  if (error) return <Text>{error.message}</Text>;

  return (
    <Card>
      <Stack>
        <Title order={4}>Config</Title>
        <Flex>
          <Text w={200}>Imam Key</Text>
          <TextInput
            defaultValue={config?.imamKey}
            onChange={(e) => setConfig({ ...config, imamKey: e.target.value })}
          />
        </Flex>
        <Flex>
          <Text w={200}>Ikomah Key</Text>
          <TextInput
            defaultValue={config?.ikomahKey}
            onChange={(e) =>
              setConfig({ ...config, ikomahKey: e.target.value })
            }
          />
        </Flex>
        <Group justify="end">
          <Button onClick={handleUpdate}>Update</Button>
        </Group>
      </Stack>
    </Card>
  );
}
