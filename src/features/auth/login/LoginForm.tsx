"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { defaultValues, schema } from "./loginForm.schema";

export default function LoginForm() {
  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <></>
    // <Card
    //   shadow={!isMobile ? "sm" : undefined}
    //   padding="xl"
    //   withBorder={!isMobile}
    //   w={"100%"}
    //   maw={500}
    // >
    //   <form onSubmit={onSubmit}>
    //     <Stack>
    //       <InputText
    //         label="Adresa e-pošte"
    //         placeholder="Adresa e-pošte"
    //         name="email"
    //         control={form.control}
    //         required
    //       />
    //       <InputPassword
    //         label="Lozinka"
    //         required
    //         pb={30}
    //         placeholder="Lozinka"
    //         name="password"
    //         control={form.control}
    //       />
    //       <Button type="submit">Prijava</Button>
    //     </Stack>
    //   </form>
    // </Card>
  );
}
