
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCategories } from "@/lib/mock-data";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import Image from "next/image";

export default function AddProductPage() {
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Product Added!",
            description: "The new product has been successfully added to your store.",
        });
    };

    const handleImageChange = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };
    
    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if(file && file.type.startsWith('image/')) {
            handleImageChange(file);
        }
    }, []);

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const onFileClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const input = document.getElementById('image-upload') as HTMLInputElement;
        input.click();
    }


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
            <form onSubmit={handleSubmit}>
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
                                    <Input id="name" placeholder="e.g. Wireless Headphones" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="Provide a detailed description of the product." />
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
                                <Input 
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
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & Inventory</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (Ksh)</Label>
                                    <Input id="price" type="number" placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity</Label>
                                    <Input id="stock" type="number" placeholder="0" />
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
                                    <Label htmlFor="category">Category</Label>
                                     <Select>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockCategories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="is-new-arrival" />
                                    <Label htmlFor="is-new-arrival">Mark as New Arrival</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="is-flash-deal" />
                                    <Label htmlFor="is-flash-deal">Include in Flash Deals</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                 <div className="mt-6 flex justify-end gap-2">
                    <Link href="/admin/products">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit">Save Product</Button>
                </div>
            </form>
        </>
    );
}
