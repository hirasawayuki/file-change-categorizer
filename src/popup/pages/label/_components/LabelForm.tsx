import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import LabelPreview, { LabelDefaultStyle } from "@/components/label-preview";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  text: z.string().min(1, {
    message: "Please provide text for the label.",
  }),
  backgroundColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
    message: "Invalid color code. Use a format like #000000 or #000.",
  }),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
    message: "Invalid color code. Use a format like #000000 or #000.",
  }),
})

export type LabelFormValue = z.infer<typeof formSchema>

type Props = {
  defaultValues?: LabelFormValue;
  onSubmit: (values: LabelFormValue) => void;
}

export default function LabelForm({ defaultValues, onSubmit }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    form.reset()
  }

  const text = useWatch({
    control: form.control,
    name: "text",
    defaultValue: defaultValues?.text || "label"
  });
  const backgroundColor = useWatch({
    control: form.control,
    name: "backgroundColor",
    defaultValue: defaultValues?.backgroundColor || LabelDefaultStyle.backgroundColor,
  });
  const color = useWatch({
    control: form.control,
    name: "color",
    defaultValue: defaultValues?.color || LabelDefaultStyle.color,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <div className="flex text-sm font-medium">
          Preview:
          <LabelPreview text={text} backgroundColor={backgroundColor} color={color}/>
        </div>
        <FormField
          control={form.control}
          name="text"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Label Text<span className="text-red-500"> *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., label" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Enter the text that will appear on the label.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="backgroundColor"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Background Color<span className="text-red-500"> *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., #007bff" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Specify the background color for the label using a hex code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Text Color<span className="text-red-500"> *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., #FFFFFF" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Specify the text color for the label using a hex code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
