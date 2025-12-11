import clientRoutes from "@/clientRoutes";
import apiFetch from "@/lib/apiFetch";
import { Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";

export function Logout() {
  const navigate = useNavigate();
  return (
    <Group justify="flex-end">
      <Button
        variant="light"
        color="red"
        size="xs"
        onClick={async () => {
          modals.openConfirmModal({
            title: "Confirm Logout",
            children: "Are you sure you want to logout?",
            labels: { confirm: "Logout", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => {},
            onConfirm: async () => {
              await apiFetch.auth.logout.delete();
              navigate(clientRoutes["/login"]);
            },
          });
        }}
      >
        Logout
      </Button>
    </Group>
  );
}
