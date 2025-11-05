"use client";

import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategorySelector } from "@/components/blog/CategorySelector";
import { TagSelector } from "@/components/blog/TagSelector";
import { AdvancedEditor } from "@/components/blog/AdvancedEditor";
import { ArrowLeft, Save, Eye, Settings, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreatePostMutation } from "@/lib/api/blogApi";
import { useAppSelector } from "@/lib/hooks";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'publish';
  category: number | null;
  tags: number[];
}

export default function CreateBlogPage() {
  return (
    <ProtectedRoute>
      <CreateBlogContent />
    </ProtectedRoute>
  );
}

function CreateBlogContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      status: 'draft',
      category: null,
      tags: [],
    }
  });

  const watchedData = watch();

  const validateForm = (data: FormData) => {
    const errors: string[] = [];
    
    if (!data.title?.trim()) {
      errors.push("Title is required");
    } else if (data.title.trim().length < 5) {
      errors.push("Title must be at least 5 characters long");
    } else if (data.title.trim().length > 100) {
      errors.push("Title must be less than 100 characters");
    }
    
    if (!data.content?.trim()) {
      errors.push("Content is required");
    } else if (data.content.trim().length < 50) {
      errors.push("Content must be at least 50 characters long");
    }
    
    if (data.excerpt && data.excerpt.trim().length > 200) {
      errors.push("Excerpt must be less than 200 characters");
    }
    
    return errors;
  };

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to create posts");
      router.push('/signin');
      return;
    }

    // Validate form data
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
      toast.error(`Please fix the following issues:\n• ${validationErrors.join('\n• ')}`);
      return;
    }

    setSaveStatus('saving');
    try {
      const postData = {
        title: data.title.trim(),
        content: data.content.trim(),
        excerpt: data.excerpt?.trim() || undefined,
        status: data.status,
        categories: data.category ? [data.category] : undefined,
        tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
      };

      const result = await createPost(postData).unwrap();
      setSaveStatus('saved');
      
      const successMessage = data.status === 'publish' 
        ? '🎉 Post published successfully!' 
        : '💾 Post saved as draft!';
      toast.success(successMessage);
      
      // Navigate after brief delay to show success state
      setTimeout(() => {
        router.push(`/blog/${result.slug}`);
      }, 1500);
    } catch (error: any) {
      setSaveStatus('error');
      console.error('Failed to create post:', error);
      
      // Better error messages based on error type
      let errorMessage = 'Failed to create post';
      if (error?.status === 401) {
        errorMessage = '🔒 Authentication required. Please sign in again.';
        router.push('/signin');
      } else if (error?.status === 403) {
        errorMessage = '⛔ You do not have permission to create posts.';
      } else if (error?.status === 422) {
        errorMessage = '📝 Please check your post content and try again.';
      } else if (error?.data?.message) {
        errorMessage = `❌ ${error.data.message}`;
      } else if (error?.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      toast.error(errorMessage);
      
      // Reset status after showing error
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Preview: ${watchedData.title}</title>
            <style>
              body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
              .excerpt { font-size: 1.2em; color: #666; margin-bottom: 2em; }
              .content img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <h1>${watchedData.title}</h1>
            ${watchedData.excerpt ? `<div class="excerpt">${watchedData.excerpt}</div>` : ''}
            <div class="content">${watchedData.content}</div>
          </body>
        </html>
      `);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b">
          <div className="container px-4 py-6 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Blog
                </Link>
                <h1 className="text-3xl font-bold">Create New Post</h1>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  disabled={!watchedData.title && !watchedData.content}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  onClick={handleSubmit((data) => onSubmit({...data, status: 'draft'}))}
                  disabled={isLoading || saveStatus === 'saving'}
                  variant="outline"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleSubmit((data) => onSubmit({...data, status: 'publish'}))}
                  disabled={isLoading || saveStatus === 'saving'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-8 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="title"
                          placeholder="Enter post title..."
                          className="text-2xl font-bold"
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Controller
                      name="excerpt"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="excerpt"
                          placeholder="Brief summary of your post (optional)..."
                          rows={3}
                        />
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      A short summary that appears in post listings. Maximum 200 characters.
                    </p>
                  </div>

                  {/* Content Editor */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Controller
                      name="content"
                      control={control}
                      rules={{ required: "Content is required" }}
                      render={({ field }) => (
                        <AdvancedEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive">{errors.content.message}</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Status Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Status</h3>
                  <div className="flex items-center">
                    {saveStatus === 'saving' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : saveStatus === 'saved' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : saveStatus === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Info className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="publish">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                
                <p className="text-xs text-muted-foreground mt-2">
                  {watchedData.status === 'draft' 
                    ? 'Only you can see this post' 
                    : 'This post will be visible to everyone'}
                </p>
              </Card>

              {/* Categories */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Categories</h3>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <CategorySelector
                      selectedCategory={field.value}
                      onCategoryChange={field.onChange}
                    />
                  )}
                />
              </Card>

              {/* Tags */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Tags</h3>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagSelector
                      selectedTags={field.value}
                      onTagsChange={field.onChange}
                    />
                  )}
                />
              </Card>

              {/* Help Card */}
              <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-600" />
                  Writing Tips
                </h3>
                <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• Use headings to structure your content</li>
                  <li>• Add images to make posts more engaging</li>
                  <li>• Keep paragraphs short and readable</li>
                  <li>• Include a compelling excerpt for better SEO</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}