"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import AddressFields, { readAddress } from "@/components/checkout/AddressFields";
import { Button } from "@/components/ui/Button";
import { Checkbox, TextField, formValues } from "@/components/ui/form";
import Skeleton from "@/components/ui/Skeleton";
import { GET_ADDRESSES, SAVE_ADDRESS } from "@/graphql";
import { toast } from "@/store/toast-store";
import type { Address } from "@/types";
import { errorMessage } from "@/utils/errors";

export default function AddressesTab({ userId }: { userId: string }) {
  const { data, loading } = useQuery(GET_ADDRESSES, {
    variables: { filters: { userId }, limit: 50, sort: { primary: "DESC", createdAt: "DESC" } },
  });
  const [save, { loading: saving }] = useMutation(SAVE_ADDRESS, { refetchQueries: ["GetAddressByFilters"] });
  // null = list view, "new" = blank form, otherwise the address being edited
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const addresses = data?.getAddressByFilters.data ?? [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    const current = editing !== "new" ? editing : null;
    try {
      await save({
        variables: {
          input: {
            ...readAddress(v, "address"),
            userId,
            addressType: v.addressType || "Home",
            primary: Boolean(v.primary),
          },
          ...(current?._id ? { id: current._id } : {}),
        },
      });
      toast.success("Address saved");
      setEditing(null);
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't save this address."));
    }
  }

  if (loading && !data) {
    // Shaped like the address cards below
    return (
      <ul className="grid gap-grid md:grid-cols-2" aria-busy="true" aria-label="Loading your addresses">
        {[0, 1].map((card) => (
          <li key={card} className="flex flex-col gap-3 border border-line p-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="mt-1 h-4 w-10" />
          </li>
        ))}
      </ul>
    );
  }

  if (editing) {
    const current = editing === "new" ? null : editing;
    return (
      <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-6">
        <h2 className="text-title">{current ? "Edit address" : "New address"}</h2>
        <TextField
          label="Label"
          name="addressType"
          placeholder="Home, Work…"
          defaultValue={current?.addressType ?? ""}
        />
        <AddressFields prefix="address" defaults={current} />
        <Checkbox
          name="primary"
          defaultChecked={current?.primary ?? addresses.length === 0}
          label="Use as my default address"
        />
        <div className="flex gap-3">
          <Button type="submit" loading={saving}>
            Save address
          </Button>
          <Button type="button" variant="outline" onClick={() => setEditing(null)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {addresses.length === 0 && <p className="text-body text-muted">No saved addresses yet.</p>}
      <ul className="grid gap-grid md:grid-cols-2">
        {addresses.map((a) => (
          <li key={a._id} className="flex flex-col gap-3 border border-line p-6 text-caption">
            <p className="text-eyebrow text-muted">
              {a.addressType || "Address"}
              {a.primary && <span className="ml-2 text-ink">· Default</span>}
            </p>
            <p>
              {a.firstname} {a.lastname}
              <br />
              {[a.flat, a.addressline1, a.addressline2].filter(Boolean).join(", ")}
              <br />
              {a.city}, {a.states} {a.pincode}, {a.country}
              <br />
              {a.countryCode} {a.phone}
            </p>
            <button onClick={() => setEditing(a)} className="self-start underline">
              Edit
            </button>
          </li>
        ))}
      </ul>
      <Button variant="outline" className="self-start" onClick={() => setEditing("new")}>
        Add address
      </Button>
    </div>
  );
}
