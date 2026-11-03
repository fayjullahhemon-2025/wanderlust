"use client";

import { Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { refreshDestinations } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Destination } from "./destination-card";

const countries = [
  "Indonesia",
  "Nepal",
  "Maldives",
  "Thailand",
  "Japan",
  "Switzerland",
  "France",
  "Australia",
];

const categories = [
  "Beach",
  "Adventure",
  "Culture",
  "Wildlife",
  "City Tour",
  "Honeymoon",
];

type FormDataValues = {
  destinationName: string;
  country: string;
  categories: string;
  price: string;
  duration: string;
  departureCode: string;
  imageUrl: string;
  description: string;
};

type FormErrors = Partial<FormDataValues>;

type UpdatePayload = {
  destinationName: string;
  country: string;
  categories: string;
  price: number;
  duration: string;
  departureCode: string;
  imageUrl: string;
  description: string;
};

const initialSelections = { country: "", categories: "" };

function validate(data: FormDataValues): FormErrors {
  const nextErrors: FormErrors = {};
  if (!data.destinationName.trim())
    nextErrors.destinationName = "Title is required.";
  if (!data.country) nextErrors.country = "Country is required.";
  if (!data.categories) nextErrors.categories = "Category is required.";
  if (!data.price.trim()) nextErrors.price = "Price in USD is required.";
  else if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0)
    nextErrors.price = "Price must be a positive number.";
  if (!data.duration.trim())
    nextErrors.duration = "Duration is required (e.g., 7 Days/6 Nights).";
  if (!data.imageUrl.trim()) nextErrors.imageUrl = "Image URL is required.";
  else if (!/^https?:\/\/\S+$/.test(data.imageUrl.trim()))
    nextErrors.imageUrl = "Image URL must start with http:// or https://.";
  if (!data.departureCode.trim())
    nextErrors.departureCode = "Departure code is required.";
  if (!data.description.trim())
    nextErrors.description = "Description is required.";
  return nextErrors;
}

export function UpdateTravelPackageDialog({
  destination,
  open: controlledOpen,
  onOpenChange,
  onSave,
}: {
  destination?: Destination;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (payload: UpdatePayload) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const openValue = controlledOpen ?? internalOpen;
  const [selections, setSelections] = useState(initialSelections);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setSelections(initialSelections);
      setErrors({});
    }
  }

  function handleCancel() {
    setSelections(initialSelections);
    setErrors({});
    handleOpenChange(false);
  }

  function buildPayload(data: FormDataValues) {
    return {
      destinationName: data.destinationName,
      country: data.country,
      categories: data.categories,
      price: Number(data.price),
      duration: data.duration,
      departureCode: data.departureCode,
      imageUrl: data.imageUrl,
      description: data.description,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as FormDataValues;
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = buildPayload(data);
    onSave?.(payload);

    if (destination?._id) {
      // The backend PATCH handler never sends a response, so do not
      // await it — fire and forget the update, then refresh the cache.
      fetch(`http://localhost:5000/destinations/${destination._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(() => null);
    }
    await refreshDestinations();
    handleOpenChange(false);
  }

  return (
    <Dialog open={openValue} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline">Edit</Button>} />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Update Travel Package</DialogTitle>
          <DialogDescription>
            Make changes to the travel package details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="rounded-lg border border-dashed border-cyan-200 p-3 sm:p-4">
            <FieldGroup className="gap-4">
              <Field data-invalid={errors.destinationName ? true : undefined}>
                <FieldLabel htmlFor="update-destination-name">Title</FieldLabel>
                <Input
                  id="update-destination-name"
                  name="destinationName"
                  defaultValue={destination?.destinationName}
                  placeholder="Bali Paradise"
                  aria-invalid={errors.destinationName ? true : undefined}
                />
                <FieldError
                  errors={[
                    errors.destinationName
                      ? { message: errors.destinationName }
                      : undefined,
                  ]}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={errors.country ? true : undefined}>
                  <FieldLabel htmlFor="update-country">Country</FieldLabel>
                  <Select
                    name="country"
                    value={selections.country || destination?.country || null}
                    onValueChange={(value) =>
                      setSelections((current) => ({
                        ...current,
                        country: String(value ?? ""),
                      }))
                    }
                  >
                    <SelectTrigger
                      id="update-country"
                      className="w-full"
                      aria-invalid={errors.country ? true : undefined}
                    >
                      <SelectValue placeholder="Indonesia" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={[
                      errors.country ? { message: errors.country } : undefined,
                    ]}
                  />
                </Field>

                <Field data-invalid={errors.categories ? true : undefined}>
                  <FieldLabel htmlFor="update-categories">Category</FieldLabel>
                  <Select
                    name="categories"
                    value={
                      selections.categories || destination?.categories || null
                    }
                    onValueChange={(value) =>
                      setSelections((current) => ({
                        ...current,
                        categories: String(value ?? ""),
                      }))
                    }
                  >
                    <SelectTrigger
                      id="update-categories"
                      className="w-full"
                      aria-invalid={errors.categories ? true : undefined}
                    >
                      <SelectValue placeholder="Beach" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={[
                      errors.categories
                        ? { message: errors.categories }
                        : undefined,
                    ]}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={errors.price ? true : undefined}>
                  <FieldLabel htmlFor="update-price">Price (USD)</FieldLabel>
                  <Input
                    id="update-price"
                    name="price"
                    type="number"
                    min="0"
                    defaultValue={destination?.price}
                    placeholder="e.g., 1299"
                    aria-invalid={errors.price ? true : undefined}
                  />
                  <FieldError
                    errors={[
                      errors.price ? { message: errors.price } : undefined,
                    ]}
                  />
                </Field>

                <Field data-invalid={errors.duration ? true : undefined}>
                  <FieldLabel htmlFor="update-duration">Duration</FieldLabel>
                  <Input
                    id="update-duration"
                    name="duration"
                    defaultValue={destination?.duration}
                    placeholder="e.g., 7 Days/6 Nights"
                    aria-invalid={errors.duration ? true : undefined}
                  />
                  <FieldError
                    errors={[
                      errors.duration
                        ? { message: errors.duration }
                        : undefined,
                    ]}
                  />
                </Field>
              </div>

              <Field data-invalid={errors.departureCode ? true : undefined}>
                <FieldLabel htmlFor="update-departure-code">
                  Departure Code
                </FieldLabel>
                <Input
                  id="update-departure-code"
                  name="departureCode"
                  defaultValue={destination?.departureCode}
                  placeholder="e.g., PLV-006"
                  aria-invalid={errors.departureCode ? true : undefined}
                />
                <FieldError
                  errors={[
                    errors.departureCode
                      ? { message: errors.departureCode }
                      : undefined,
                  ]}
                />
              </Field>

              <Field data-invalid={errors.imageUrl ? true : undefined}>
                <FieldLabel htmlFor="update-image-url">Image URL</FieldLabel>
                <Input
                  id="update-image-url"
                  name="imageUrl"
                  type="url"
                  defaultValue={destination?.imageUrl}
                  placeholder="https://example.com/image.jpg"
                  aria-invalid={errors.imageUrl ? true : undefined}
                />
                <FieldError
                  errors={[
                    errors.imageUrl ? { message: errors.imageUrl } : undefined,
                  ]}
                />
              </Field>

              <Field data-invalid={errors.description ? true : undefined}>
                <FieldLabel htmlFor="update-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="update-description"
                  name="description"
                  defaultValue={destination?.description}
                  placeholder="Describe the travel experience..."
                  rows={4}
                  aria-invalid={errors.description ? true : undefined}
                />
                <FieldError
                  errors={[
                    errors.description
                      ? { message: errors.description }
                      : undefined,
                  ]}
                />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter className="border-none bg-transparent p-0 pt-4">
            <Button
              type="button"
              variant="destructive"
              className="bg-white"
              onClick={handleCancel}
            >
              <Trash2 className="text-destructive" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cyan-500 text-white hover:bg-cyan-600"
            >
              <Save className="text-white" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
