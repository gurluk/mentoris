import { createTheme, MantineTheme } from "@mantine/core";

export const theme = createTheme({
  components: {
    Button: {
      styles: {
        root: {
          transition: "all 250ms ease",
        },
      },
    },
    InputWrapper: {
      styles: (theme: MantineTheme) => ({
        input: {
          transition: "all 300ms ease",
        },
        label: {
          color: theme.colors.dark[6], // or custom
          opacity: 0.6,
        },
      }),
    },
  },
});
