import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a repository name.",
  }),
  organization: z.string().min(1, {
    message: "Please enter an organization name.",
  })
})

export type RepositoryFormValue = z.infer<typeof formSchema>;

type Props = {
  defaultValues?: RepositoryFormValue;
  onSubmit: (values: RepositoryFormValue) => Promise<void> | void;
}

export default function RepositoryForm({ defaultValues, onSubmit }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((value: RepositoryFormValue) => {
          onSubmit(value)
          form.reset()
        })}
      >
        <FormField
          control={form.control}
          name="organization"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Github Organization<span className="text-red-500"> *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., github" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Enter the name of the organization that owns this repository, such as 'GitHub'.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Repository Name<span className="text-red-500"> *</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., my-awesome-repo" {...field}  value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Enter the name of the repository, such as 'my-awesome-repo'.
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
