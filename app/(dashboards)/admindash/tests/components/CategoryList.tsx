// app/(dashboards)/admindash/tests/components/CategoryList.tsx
"use client"

import * as React from "react"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import type { TestFormValues } from "@/lib/validations/tests"
import { QuestionList } from "./QuestionList"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface CategoryListProps {
  form: UseFormReturn<TestFormValues>
}

export function CategoryList({ form }: CategoryListProps) {
  const { fields: categories, append, remove } = useFieldArray({
    control: form.control,
    name: "categories"
  });

  const handleAddCategory = () => {
    append({
      name: "",
      description: "", // Changed from null to empty string
      scale: 0,
      questions: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Categories</h3>
        <Button
          type="button"
          onClick={handleAddCategory}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {categories.map((category, index) => (
        <Card key={category.id} className="p-6">
          <CardHeader className="flex flex-row items-start justify-between p-0 pb-4">
            <div className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name={`categories.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter category name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name={`categories.${index}.scale`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scale</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min={0}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                          value={field.value || ''}
                          placeholder="Enter scale value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name={`categories.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''} // Convert null/undefined to empty string
                        placeholder="Enter category description"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <QuestionList 
              form={form} 
              categoryIndex={index} 
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}