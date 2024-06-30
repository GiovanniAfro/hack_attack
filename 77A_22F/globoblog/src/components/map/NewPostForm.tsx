"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Slider } from "~/components/ui/slider";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { FunctionComponent } from "react";
import { api } from "~/utils/api";
import { NoiseLevel } from "@prisma/client";
import { env } from "~/env";
import { useRouter } from "next/router";

const FormSchema = z.object({
  title: z.string().min(1, {
    message: "Title required.",
  }),
  description: z.string().min(1, {
    message: "Description required",
  }),
  city: z.string().min(1),
  address: z.string().min(1),
  noiselevel: z.number().min(0).max(100),
});

export type NewPostFormProps = {};

export const NewPostForm: FunctionComponent = () => {
  const router = useRouter();
  const postCreateMutation = api.post.create.useMutation({
    onSuccess(data, variables, context) {
      router.reload();
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      noiselevel: 50,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let res: NoiseLevel = NoiseLevel.SILENT;
    if (data.noiselevel >= 0 && data.noiselevel < 16) res = NoiseLevel.SILENT;
    else if (data.noiselevel > 16 && data.noiselevel <= 32)
      res = NoiseLevel.LOW;
    else if (data.noiselevel > 32 && data.noiselevel <= 48)
      res = NoiseLevel.MEDIUM;
    else if (data.noiselevel > 48 && data.noiselevel <= 64)
      res = NoiseLevel.HIGH;
    else if (data.noiselevel > 64 && data.noiselevel <= 80)
      res = NoiseLevel.VERY_HIGH;
    else if (data.noiselevel > 80 && data.noiselevel <= 100)
      res = NoiseLevel.VERY_HIGH;

    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${data.address}&access_token=${env.NEXT_PUBLIC_MAPBOX_SECRET}`;

    const apiCall = await fetch(url);
    const json = await apiCall.json();
    const feature = json.features.length ? json.features[0] : null;
    const address = feature?.properties?.context?.address?.name ?? "";
    console.log(json);
    const city = feature?.properties?.context.place?.name ?? "";


    const lat = feature?.properties?.coordinates.latitude;
    const lng = feature?.properties?.coordinates.longitude;


    postCreateMutation.mutate({
      address,
      city,
      latitude: lat,
      longitude: lng,
      content: data.description,
      object: data.title,
      noiseLevel: res,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-slate-950 px-2 py-3 sm:px-4 sm:py-5"
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormDescription>Provide an address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Your title" {...field} />
              </FormControl>
              <FormDescription>
                Enter a title for your submission.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Your description" {...field} />
              </FormControl>
              <FormDescription>Provide a detailed description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="noiselevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noise Level</FormLabel>
              <FormControl>
                <Controller
                  control={form.control}
                  name="noiselevel"
                  render={({ field }) => (
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      defaultValue={[50]}
                      max={100}
                      step={1}
                    />
                  )}
                />
              </FormControl>
              <FormDescription>Set the noise level.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" onClick={()=>onSubmit(form.getValues())}>Submit</Button>
      </form>
    </Form>
  );
};
