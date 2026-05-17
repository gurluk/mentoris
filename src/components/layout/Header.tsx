import { Button, Flex, Group } from "@mantine/core";

import AppContainer from "./AppContainer";

export default function Header() {
  return (
    <AppContainer>
      <Flex justify="flex-end" py="sm">
        <Group gap="xs">
          <Button color="gray" variant="subtle">
            Dijeli svoje znanje
          </Button>
        </Group>
      </Flex>
    </AppContainer>
  );
}
