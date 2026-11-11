import { type FieldVariant, SelectField, TextField } from "@/components/ui/form";
import { indianStates } from "@/config/regions";
import type { Address } from "@/types";
import { cn } from "@/utils/cn";

type AddressInput = Omit<Address, "_id" | "userId">;

interface AddressFieldsProps {
  /** field-name prefix, so one form can hold two addresses ("shipping", "billing") */
  prefix: string;
  defaults?: Partial<Address> | null;
  /** box: the account forms. line: the checkout's underlined fields, in its shorter layout. */
  variant?: FieldVariant;
  /** false when the name and phone are asked for elsewhere (checkout's Contact section) */
  contact?: boolean;
}

/** Name and phone inputs, named `${prefix}.field` like the rest of the address */
export function ContactFields({
  prefix,
  defaults,
  variant = "box",
}: Pick<AddressFieldsProps, "prefix" | "defaults" | "variant">) {
  const line = variant === "line";
  const ac = (token: string) => `${prefix === "billing" ? "billing" : "shipping"} ${token}`;
  return (
    <div className={cn("grid grid-cols-2", line ? "gap-x-8 gap-y-6" : "gap-4")}>
      <TextField
        label="First name"
        name={`${prefix}.firstname`}
        variant={variant}
        defaultValue={defaults?.firstname}
        autoComplete={ac("given-name")}
        required
      />
      <TextField
        label="Last name"
        name={`${prefix}.lastname`}
        variant={variant}
        defaultValue={defaults?.lastname}
        autoComplete={ac("family-name")}
        required
      />
      <div className={cn("col-span-2 grid grid-cols-[5rem_1fr]", line ? "gap-5" : "gap-3")}>
        <TextField
          label="Code"
          name={`${prefix}.countryCode`}
          variant={variant}
          defaultValue={defaults?.countryCode ?? "+91"}
          autoComplete={ac("tel-country-code")}
          required
        />
        <TextField
          label="Phone"
          name={`${prefix}.phone`}
          type="tel"
          variant={variant}
          placeholder={line ? "98765 43210" : undefined}
          defaultValue={defaults?.phone}
          autoComplete={ac("tel-national")}
          required
        />
      </div>
    </div>
  );
}

/** Address inputs named `${prefix}.field`; read them back with readAddress() */
export default function AddressFields({ prefix, defaults, variant = "box", contact = true }: AddressFieldsProps) {
  const name = (field: keyof Address) => `${prefix}.${field}`;
  const ac = (token: string) => `${prefix === "billing" ? "billing" : "shipping"} ${token}`;
  // key on the default's id so picking a saved address re-fills the inputs
  const k = defaults?._id ?? "new";
  const states = defaults?.states && !indianStates.includes(defaults.states) ? [defaults.states] : [];

  const city = (
    <TextField
      label="City"
      name={name("city")}
      variant={variant}
      defaultValue={defaults?.city}
      autoComplete={ac("address-level2")}
      required
    />
  );
  const state = (
    <SelectField
      label="State"
      name={name("states")}
      variant={variant}
      defaultValue={defaults?.states ?? ""}
      autoComplete={ac("address-level1")}
      required
      options={[
        { value: "", label: "Select a state" },
        ...[...states, ...indianStates].map((s) => ({ value: s, label: s })),
      ]}
    />
  );
  const pincode = (
    <TextField
      label="PIN code"
      name={name("pincode")}
      variant={variant}
      defaultValue={defaults?.pincode}
      autoComplete={ac("postal-code")}
      inputMode="numeric"
      required
    />
  );
  const country = (
    <TextField
      label="Country / region"
      name={name("country")}
      variant={variant}
      defaultValue={defaults?.country ?? "India"}
      autoComplete={ac("country-name")}
      required
    />
  );

  if (variant === "line") {
    return (
      <div key={k} className="flex flex-col gap-6">
        {contact && <ContactFields prefix={prefix} defaults={defaults} variant="line" />}
        {country}
        <TextField
          label="Address"
          name={name("addressline1")}
          variant="line"
          placeholder="House number and street"
          defaultValue={defaults?.addressline1}
          autoComplete={ac("address-line1")}
          required
        />
        <TextField
          label="Apartment, floor, landmark (optional)"
          name={name("addressline2")}
          variant="line"
          defaultValue={defaults?.addressline2 ?? ""}
          autoComplete={ac("address-line2")}
        />
        {/* Not asked for here, but kept so a saved address keeps them */}
        <input type="hidden" name={name("flat")} value={defaults?.flat ?? ""} />
        <input type="hidden" name={name("landmark")} value={defaults?.landmark ?? ""} />
        <div className="grid gap-6 sm:grid-cols-3 sm:gap-5">
          {city}
          {state}
          {pincode}
        </div>
      </div>
    );
  }

  return (
    <div key={k} className="flex flex-col gap-4">
      {contact && <ContactFields prefix={prefix} defaults={defaults} />}
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Flat / house no."
          name={name("flat")}
          defaultValue={defaults?.flat ?? ""}
          className="col-span-2 md:col-span-1"
        />
        <TextField
          label="Address"
          name={name("addressline1")}
          defaultValue={defaults?.addressline1}
          autoComplete={ac("address-line1")}
          required
          className="col-span-2 md:col-span-1"
        />
        <TextField
          label="Area / street (optional)"
          name={name("addressline2")}
          defaultValue={defaults?.addressline2 ?? ""}
          autoComplete={ac("address-line2")}
          className="col-span-2 md:col-span-1"
        />
        <TextField
          label="Landmark (optional)"
          name={name("landmark")}
          defaultValue={defaults?.landmark ?? ""}
          className="col-span-2 md:col-span-1"
        />
        {city}
        {state}
        {pincode}
        {country}
      </div>
    </div>
  );
}

/** Pulls `${prefix}.*` values out of formValues() into an address object */
export function readAddress(values: Record<string, string>, prefix: string): AddressInput {
  const get = (field: string) => values[`${prefix}.${field}`] ?? "";
  return {
    firstname: get("firstname"),
    lastname: get("lastname"),
    flat: get("flat"),
    addressline1: get("addressline1"),
    addressline2: get("addressline2"),
    landmark: get("landmark"),
    city: get("city"),
    states: get("states"),
    pincode: get("pincode"),
    country: get("country"),
    countryCode: get("countryCode"),
    phone: get("phone"),
  };
}
