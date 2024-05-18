import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";

export type PatternFormValue = {
  pattern: string;
}

type Props = {
  defaultValues?: PatternFormValue;
  onSubmit: (values: PatternFormValue) => Promise<void> | void;
  patterns: string[];
}

export default function PatternForm({ defaultValues, onSubmit, patterns }: Props) {
  const formSchema = z.object({
    pattern: z.string().refine(
      (value) => !patterns.includes(value),
      (value) => ({message: `${value} is already registered. Please enter a different path.`}),
    )
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (value: z.infer<typeof formSchema>) => {
    onSubmit(value)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="pattern"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Pattern<span className="text-red-500"> *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., awesome/src/*.ts" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Specify a pattern to match files.
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
