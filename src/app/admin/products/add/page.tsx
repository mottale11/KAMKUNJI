
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.preprocess(
      (a) => parseFloat(z.string().parse(a)),
      z.number().positive("Price must be a positive number")
    ),
    original_price: z.preprocess(
      (a) => (a === '' || a === undefined || a === null ? null : parseFloat(z.string().parse(a))),
      z.number().positive("Original price must be a positive number").optional().nullable()
    ),
    stock: z.preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number().int().min(0, "Stock can't be negative")
    ),
    category_id: z.string().min(1, "Category is required"),
    is_new_arrival: z.boolean().default(false),
    is_flash_deal: z.boolean().default(false),
    image: z.instanceof(File).refine(file => file.size > 0, "Product image is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            is_new_arrival: false,
            is_flash_deal: false,
            original_price: null,
        }
    });

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const { data, error } = await supabase.from('categories').select('*');
                if (error) throw error;
                if (data) setCategories(data as Category[]);
            } catch(e) {
                console.error("Error fetching categories:", e);
                toast({ variant: 'destructive', title: "Error", description: "Could not load categories."})
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [toast]);

    const imageFile = watch('image');

    const handleImageChange = (file: File | null) => {
        if (file) {
            setValue("image", file, { shouldValidate: true });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
            setValue("image", new File([], ""), { shouldValidate: true });
        }
    };

     const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageChange(file);
        }
    }, []);

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const onFileClick = () => {
        document.getElementById('image-upload')?.click();
    };

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            // 1. Sanitize filename and upload image to Supabase Storage
            const sanitizedFileName = data.image.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
            const filePath = `${Date.now()}_${sanitizedFileName}`;
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, data.image);

            if (uploadError) throw uploadError;

            // 2. Get public URL for the uploaded image
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            // 3. Add product data to Supabase database
            const { error: insertError } = await supabase
                .from('products')
                .insert({
                    title: data.name,
                    description: data.description,
                    price: data.price,
                    original_price: data.original_price,
                    category_id: data.category_id,
                    stock: data.stock,
                    image_url: publicUrl,
                    is_new_arrival: data.is_new_arrival,
                    is_flash_deal: data.is_flash_deal,
                });

            if (insertError) throw insertError;


            toast({
                title: "Product Added!",
                description: "The new product has been successfully added to your store.",
            });
            router.push('/admin/products');
        } catch (error: any) {
            console.error("Error adding product:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to add product. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/products">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Add New Product</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>Fill out the information for your new product.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" placeholder="e.g. Wireless Headphones" {...register("name")} />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="Provide a detailed description of the product." {...register("description")} />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-1 space-y-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Product Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <input
                                    type="file"
                                    id="image-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e.target.files ? e.target.files[0] : null)}
                                />
                                <div
                                    className="w-full aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground cursor-pointer"
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    onClick={onFileClick}
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-full">
                                            <Image src={imagePreview} alt="Image preview" fill className="object-contain rounded-md" />
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8" />
                                            <span>Click or drag to upload</span>
                                        </>
                                    )}
                                </div>
                                {errors.image && <p className="text-sm text-destructive mt-2">{errors.image.message}</p>}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & Inventory</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="original_price">Original Price (Ksh) (Optional)</Label>
                                    <Input id="original_price" type="number" step="0.01" placeholder="e.g. 5500.00" {...register("original_price")} />
                                    {errors.original_price && <p className="text-sm text-destructive">{errors.original_price.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Sale Price (Ksh)</Label>
                                    <Input id="price" type="number" step="0.01" placeholder="e.g. 4500.00" {...register("price")} />
                                     {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity</Label>
                                    <Input id="stock" type="number" placeholder="0" {...register("stock")} />
                                    {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Categorization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Category</Label>
                                    <Controller
                                        name="category_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCategories}>
                                                <SelectTrigger id="category_id">
                                                    <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Controller
                                        name="is_new_arrival"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox id="is_new_arrival" checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                    <Label htmlFor="is_new_arrival">Mark as New Arrival</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Controller
                                        name="is_flash_deal"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox id="is_flash_deal" checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                    <Label htmlFor="is_flash_deal">Include in Flash Deals</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                 <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/products">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save Product'}
                    </Button>
                </div>
            </form>
        </>
    );
}

    

    