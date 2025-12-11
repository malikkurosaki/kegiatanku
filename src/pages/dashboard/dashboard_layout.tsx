import { useEffect, useState } from "react";

import {
  ActionIcon,
  AppShell,
  Avatar,
  Card,
  Divider,
  Flex,
  Group,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDashboard,
  IconKey,
  IconSettings,
} from "@tabler/icons-react";
import type { User } from "generated/prisma";
import { useLocation, useNavigate } from "react-router-dom";

import {
  default as clientRoute,
  default as clientRoutes,
} from "@/clientRoutes";
import { Logout } from "@/components/Logout";
import RoleRoute from "@/components/RoleRoute";
import apiFetch from "@/lib/apiFetch";

/* ----------------------- Layout ----------------------- */
export default function DashboardLayout() {
  const [opened, setOpened] = useLocalStorage({
    key: "nav_open",
    defaultValue: true,
  });

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
    >
      {/* NAVBAR */}
      <AppShell.Navbar p="sm">
        {/* Collapse toggle */}
        <AppShell.Section>
          <Group justify="flex-end">
            <Tooltip
              label={opened ? "Collapse navigation" : "Expand navigation"}
              withArrow
            >
              <ActionIcon
                variant="light"
                color="gray"
                onClick={() => setOpened((v) => !v)}
                radius="xl"
              >
                {opened ? <IconChevronLeft /> : <IconChevronRight />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </AppShell.Section>

        {/* Navigation */}
        <AppShell.Section grow component={ScrollArea} mt="sm">
          <NavigationDashboard />
        </AppShell.Section>

        {/* User info */}
        <AppShell.Section>
          <HostView />
        </AppShell.Section>
      </AppShell.Navbar>

      {/* MAIN CONTENT */}
      <AppShell.Main>
        <Stack>
          <Paper withBorder radius="lg" p="md" shadow="sm">
            <Flex align="center" gap="md">
              {!opened && (
                <Tooltip label="Open navigation menu" withArrow>
                  <ActionIcon
                    variant="light"
                    color="gray"
                    onClick={() => setOpened(true)}
                    radius="xl"
                  >
                    <IconChevronRight />
                  </ActionIcon>
                </Tooltip>
              )}

              <Title order={3} fw={600}>
                App Dashboard
              </Title>
            </Flex>
          </Paper>
          <RoleRoute role="ADMIN" />
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}

/* ----------------------- Host Info ----------------------- */
function HostView() {
  const [host, setHost] = useState<User | null>(null);

  useEffect(() => {
    async function fetchHost() {
      const { data } = await apiFetch.api.user.find.get();
      setHost(data?.user ?? null);
    }
    fetchHost();
  }, []);

  return (
    <Card radius="md" withBorder shadow="xs" p="md">
      {host ? (
        <Stack gap="sm">
          <Flex gap="md" align="center">
            <Avatar size="lg" radius="xl" color="blue">
              {host.name?.[0]}
            </Avatar>

            <Stack gap={2}>
              <Text fw={600} size="sm">
                {host.name}
              </Text>
              <Text size="xs" c="dimmed">
                {host.email}
              </Text>
            </Stack>
          </Flex>

          <Divider />
          <Logout />
        </Stack>
      ) : (
        <Text size="sm" c="dimmed" ta="center">
          No host information available
        </Text>
      )}
    </Card>
  );
}

/* ----------------------- Navigation ----------------------- */
function NavigationDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: keyof typeof clientRoute) =>
    location.pathname.startsWith(clientRoute[path]);

  return (
    <Stack gap="xs">
      <NavLink
        active={isActive("/dashboard/dashboard")}
        leftSection={<IconDashboard size={18} />}
        label="Dashboard Overview"
        description="Quick summary and activity highlights"
        onClick={() => navigate(clientRoutes["/dashboard/dashboard"])}
      />

      <NavLink
        active={isActive("/dashboard/apikey/apikey")}
        leftSection={<IconKey size={18} />}
        label="API Keys"
        description="Manage your API credentials"
        onClick={() => navigate(clientRoutes["/dashboard/apikey/apikey"])}
      />

      <NavLink
        active={isActive("/dashboard/config/config")}
        leftSection={<IconSettings size={18} />}
        label="Config"
        description="Manage your app config"
        onClick={() => navigate(clientRoutes["/dashboard/config/config"])}
      />
      <NavLink
        active={isActive("/dashboard/shalat/dashboard-shalat")}
        leftSection={<IconSettings size={18} />}
        label="Jadwal Imam"
        description="Manage your app config"
        onClick={() =>
          navigate(clientRoutes["/dashboard/shalat/dashboard-shalat"])
        }
      />
    </Stack>
  );
}
