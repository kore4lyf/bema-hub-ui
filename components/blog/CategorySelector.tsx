"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetCategoriesQuery, useCreateCategoryMutation } from "@/lib/api/blogApi";
import { X, Plus, Folder, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CategorySelectorProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  className?: string;
}

export function CategorySelector({ selectedCategory, onCategoryChange, className }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  const { data: categories = [], isLoading, refetch } = useGetCategoriesQuery();
  
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const selectedCategoryObject = selectedCategory 
    ? categories.find(category => category.id === selectedCategory) 
    : null;

  const availableCategories = categories.filter(category => category.id !== selectedCategory);

  const handleSelectCategory = (categoryId: number) => {
    onCategoryChange(categoryId);
    setOpen(false);
  };

  const handleRemoveCategory = () => {
    onCategoryChange(null);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
        slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      }).unwrap();

      // Set the new category as selected
      onCategoryChange(newCategory.id);
      
      // Reset form
      setNewCategoryName("");
      setShowCreateCategory(false);
      setOpen(false);
      
      toast.success(`Category "${newCategory.name}" created successfully!`);
      
      // Refetch categories to include the new one
      refetch();
    } catch (error: any) {
      console.error('Failed to create category:', error);
      toast.error(error?.data?.message || 'Failed to create category');
    }
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Selected Category */}
        {selectedCategoryObject && (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <Folder className="h-3 w-3" />
              {selectedCategoryObject.name}
              <button
                type="button"
                onClick={handleRemoveCategory}
                className="hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}

        {/* Category Selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left font-normal"
            >
              <Folder className="h-4 w-4 mr-2" />
              {!selectedCategory 
                ? "Select category..." 
                : selectedCategoryObject?.name || "Select category..."
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search categories..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      {searchValue ? `No categories found for "${searchValue}"` : "No categories found"}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setNewCategoryName(searchValue);
                        setShowCreateCategory(true);
                      }}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Create "{searchValue || 'new category'}"
                    </Button>
                  </div>
                </CommandEmpty>
                
                {availableCategories.length > 0 && (
                  <CommandGroup heading="Available Categories">
                    {availableCategories.map((category) => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => handleSelectCategory(category.id)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="h-3 w-3" />
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {searchValue && !showCreateCategory && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setNewCategoryName(searchValue);
                        setShowCreateCategory(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create "{searchValue}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>

            {/* Create New Category Form */}
            {showCreateCategory && (
              <div className="border-t p-3 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Create New Category</label>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateCategory();
                      } else if (e.key === 'Escape') {
                        setShowCreateCategory(false);
                        setNewCategoryName("");
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateCategory}
                    disabled={isCreating || !newCategoryName.trim()}
                    className="flex-1"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3 mr-1" />
                        Create
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCreateCategory(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading categories...
          </div>
        )}
      </div>
    </div>
  );
}