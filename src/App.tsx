import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider } from "@mantine/core";
import AppRoutes from "./AppRoutes";


import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";


export function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications />
      <ModalsProvider>
        <AppRoutes />
      </ModalsProvider>
    </MantineProvider>
  );
}
