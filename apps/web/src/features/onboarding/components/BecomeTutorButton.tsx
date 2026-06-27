import { Button } from "@mantine/core";
import { GraduationCap } from "lucide-react";

export default function BecomeTutorButton() {
  return (
    <Button
      size="compact-lg"
      variant="default"
      mr={10}
      leftSection={<GraduationCap />}
    >
      Postani mentor
    </Button>
  );
}
