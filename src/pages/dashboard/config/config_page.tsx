import apiFetch from "@/lib/apiFetch";
import { Container, Stack, Switch, Text } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import useSWR from "swr";

export default function ConfigPage() {
  const { data, error, isLoading } = useSWR(
    "/",
    apiFetch["get-allow-register"].get,
  );

  const [allowRegister, setAllowRegister] = useState(false);

  useShallowEffect(() => {
    if (data) {
      setAllowRegister(data.data?.allowRegister ?? false);
    }
  }, [data]);

  if (isLoading)
    return (
      <Container size="lg" w={"100%"}>
        <Text>Loading...</Text>
      </Container>
    );
  if (error)
    return (
      <Container size="lg" w={"100%"}>
        <Text>Error: {error.message}</Text>
      </Container>
    );

  async function updateAllowRegister({
    allowRegister,
  }: {
    allowRegister: boolean;
  }) {
    const res = await apiFetch.api.configs["update-allow-register"].post({
      allowRegister: allowRegister,
    });
    console.log(res.data);
    setAllowRegister(res.data?.allowRegister ?? false);
  }

  return (
    <Container size="lg" w={"100%"}>
      <Stack>
        <Text>Config Page</Text>
        <Switch
          label="Allow Register"
          checked={allowRegister}
          onChange={(e) => {
            updateAllowRegister({ allowRegister: !allowRegister });
          }}
        />
      </Stack>
    </Container>
  );
}
