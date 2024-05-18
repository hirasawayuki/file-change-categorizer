import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import LabelPreview from "@/popup/pages/rule/_components/Label";
import { Label } from "@/types";

const formSchema = z.object({
  labelUid: z.string(),
  pattern: z.string().optional(),
  enableCloseFileOption: z.boolean(),
});

export type RuleFormValue = z.infer<typeof formSchema>;

type Props = {
  defaultValues?: Omit<RuleFormValue, "pattern">;
  onSubmit: (values: RuleFormValue) => Promise<void> | void;
  labels: Label[];
}

export default function RuleForm({defaultValues, onSubmit, labels}: Props) {
  const form = useForm<RuleFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {enableCloseFileOption: false, ...defaultValues},
  })

  const handleSubmit = (value: RuleFormValue) => {
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
          name="labelUid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Label<span className="text-red-500"> *</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a label" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent {...field}>
                  <SelectGroup>
                    <SelectLabel>Labels</SelectLabel>
                    {labels.map((label) => (
                      <SelectItem key={label.uid} value={label.uid}><LabelPreview labelUid={label.uid} /></SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>Select a label to apply.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        { !defaultValues &&
          <FormField
            control={form.control}
            name="pattern"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Pattern
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
        }
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Options</p>
          <FormField
            control={form.control}
            name="enableCloseFileOption"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} /> 
                </FormControl>
                <FormLabel>Enable file closing feature</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
