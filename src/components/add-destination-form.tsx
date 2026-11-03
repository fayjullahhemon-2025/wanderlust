"use client";

import { useState } from "react";
import { refreshDestinations } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
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

const initialSelections = { country: "", categories: "" };

type FormErrors = Partial<FormDataValues>;

export function AddDestinationForm() {
  const [selections, setSelections] = useState(initialSelections);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(data: FormDataValues): FormErrors {
    const nextErrors: FormErrors = {};
    if (!data.destinationName.trim())
      nextErrors.destinationName = "Destination name is required.";
    if (!data.country) nextErrors.country = "Country is required.";
    if (!data.categories) nextErrors.categories = "Categories is required.";
    if (!data.price.trim()) nextErrors.price = "Price in USD is required.";
    else if (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0)
      nextErrors.price = "Price must be a positive number.";
    if (!data.duration.trim())
      nextErrors.duration = "Duration is required (e.g., 5 Days/4 Nights).";
    if (!data.departureCode.trim())
      nextErrors.departureCode = "Departure code is required.";
    if (!data.imageUrl.trim()) nextErrors.imageUrl = "Image URL is required.";
    else if (!/^https?:\/\/\S+$/.test(data.imageUrl.trim()))
      nextErrors.imageUrl = "Image URL must start with http:// or https://.";
    if (!data.description.trim())
      nextErrors.description = "Description is required.";
    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormDataValues;
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      ...data,
      price: Number(data.price),
    };
    console.log("Add travel package:", payload);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/add-destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      await res.json();
      await refreshDestinations();
      setSuccess(true);
      setSelections(initialSelections);
      form.reset();
    } catch (err) {
      setSuccess(false);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  }

  function handleCancel(event: React.MouseEvent<HTMLButtonElement>) {
    setSelections(initialSelections);
    setErrors({});
    setSuccess(false);
    setError(null);
    event.currentTarget.form?.reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <FieldGroup className="p-6 sm:p-8">
          <Field data-invalid={errors.destinationName ? true : undefined}>
            <FieldLabel htmlFor="destination-name">Destination Name</FieldLabel>
            <Input
              id="destination-name"
              name="destinationName"
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={errors.country ? true : undefined}>
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Select
                name="country"
                value={selections.country || null}
                onValueChange={(value) =>
                  setSelections((current) => ({
                    ...current,
                    country: String(value ?? ""),
                  }))
                }
              >
                <SelectTrigger
                  id="country"
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
              <FieldLabel htmlFor="categories">Categories</FieldLabel>
              <Select
                name="categories"
                value={selections.categories || null}
                onValueChange={(value) =>
                  setSelections((current) => ({
                    ...current,
                    categories: String(value ?? ""),
                  }))
                }
              >
                <SelectTrigger
                  id="categories"
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={errors.price ? true : undefined}>
              <FieldLabel htmlFor="price">Price in USD</FieldLabel>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                placeholder="e.g., 2700"
                aria-invalid={errors.price ? true : undefined}
              />
              <FieldError
                errors={[errors.price ? { message: errors.price } : undefined]}
              />
            </Field>

            <Field data-invalid={errors.duration ? true : undefined}>
              <FieldLabel htmlFor="duration">Duration</FieldLabel>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 5 Days/4 Nights"
                aria-invalid={errors.duration ? true : undefined}
              />
              <FieldError
                errors={[
                  errors.duration ? { message: errors.duration } : undefined,
                ]}
              />
            </Field>
          </div>

          <Field data-invalid={errors.departureCode ? true : undefined}>
            <FieldLabel htmlFor="departure-code">Departure Code</FieldLabel>
            <FieldDescription className="sr-only">
              Short code identifying this package's departure.
            </FieldDescription>
            <Input
              id="departure-code"
              name="departureCode"
              placeholder="e.g., BLI-05"
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
            <FieldLabel htmlFor="image-url">Image URL</FieldLabel>
            <Input
              id="image-url"
              name="imageUrl"
              type="url"
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
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
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

          <div className="flex flex-col-reverse items-stretch justify-end gap-2 pt-2 sm:flex-row sm:items-center">
            {success ? (
              <output className="text-sm font-medium text-emerald-600 sm:mr-auto">
                Travel package added successfully.
              </output>
            ) : null}
            {error ? (
              <output className="text-sm font-medium text-destructive sm:mr-auto">
                {error}
              </output>
            ) : null}
            <Button type="button" variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cyan-500 text-white hover:bg-cyan-600"
            >
              Add Travel Package
            </Button>
          </div>
        </FieldGroup>
      </div>
    </form>
  );
}
