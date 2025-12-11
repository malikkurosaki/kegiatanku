import { Logout } from "@/components/Logout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "@mantine/core";

export default function ProfileLayout() {
  return (
    <Stack>
      <Logout />
      <ProtectedRoute />
    </Stack>
  );
}
