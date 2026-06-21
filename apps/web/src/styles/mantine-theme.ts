import { createTheme } from "@mantine/core";

export const mantineTheme = createTheme({
  black: "#2b2b2b",
  primaryColor: "teal",
  primaryShade: 7,
  fontFamily: "var(--font-jakarta)",
  defaultRadius: "md",
  components: {
    ActionIcon: {
      defaultProps: {
        size: "input-sm",
      },
    },
    Button: {
      defaultProps: {
        size: "sm",
      },
      styles: {
        root: {
          transition:
            "background-color 200ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease",
        },
      },
    },
    Input: {
      defaultProps: {
        size: "md",
      },
    },
    InputWrapper: {
      styles: {
        label: {
          fontSize: "0.9em",
          fontWeight: 500,
        },
        error: { fontSize: "0.8em", fontWeight: 500 },
      },
    },
    Container: {
      defaultProps: {
        size: "xl",
      },
      vars: () => ({
        root: {
          "--container-size-xl": "1420px",
        },
      }),
      styles: {
        root: {
          paddingInline: "32px",
        },
      },
    },
  },
});
