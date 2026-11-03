"use client";

import { useRouter } from "next/navigation";
import { refreshDestinations } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Destination } from "./destination-card";

export function DeleteConfirmationDialog({
  destination,
}: {
  destination: Destination;
}) {
  const router = useRouter();

  async function handleDelete() {
    // Note: the backend exposes DELETE under /destination/:id (singular).
    const res = await fetch(
      `http://localhost:5000/destination/${destination._id}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      console.error(`Failed to delete destination (${res.status})`);
      return;
    }
    await refreshDestinations();
    router.push("/destinations");
  }

  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="destructive">Delete Package</Button>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            travel package from the database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose
            render={
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
