import React, { useState } from "react";
import { TextField, Autocomplete, Box } from "@mui/material";
import type { Address, PhotonPlace } from '../types';

interface Props {
    value: Address;

    onChange: (address: Address) => void;
}

const fetchAddressSuggestions = async (query: string): Promise<PhotonPlace[]> => {
    if (!query || query.length < 3) return [];
    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.features || [];
};

const AddressForm: React.FC<Props> = ({ value, onChange }) => {
    const [suggestions, setSuggestions] = useState<PhotonPlace[]>([]);

    const handleAutocompleteInput = async (query: string) => {
        const results = await fetchAddressSuggestions(query);
        setSuggestions(results);
    };

    const handleSelectSuggestion = (place: PhotonPlace) => {
        const { name, city, zip, state, country } = place.properties;
        const full = [name, city, zip, state, country].filter(Boolean).join(", ");
        onChange({ street1: name ?? "", city: city ?? "", zip: zip ?? "", state: state, country: country ?? "", full });
        setSuggestions([]);
    };

    const handleFieldChange = (field: keyof Address, val: string) => {
        const updated = { ...value, [field]: val };
        updated.full = [updated.street1, updated.street2, updated.city, updated.zip, updated.state, updated.country]
            .filter(Boolean)
            .join(", ");
        onChange(updated);
    };

    return (
        <Box sx={{ mb: 2 }}>
         {/* Street 1 — with autocomplete */}
<Autocomplete
  freeSolo
  options={suggestions}
  getOptionLabel={(option) => {
    if (typeof option === "string") return option;
    const { name, city, zip, state, country } = option.properties;
    return [name, city, zip, state, country].filter(Boolean).join(", ");
  }}
  onInputChange={(_, val) => {
    handleAutocompleteInput(val);
    handleFieldChange("street1", val);
  }}
  onChange={(_, val) => {
    if (val && typeof val !== "string") handleSelectSuggestion(val);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Street address"
      placeholder="Start typing your address..."
      fullWidth
      sx={{ mb: 1 }}
      required
    />
  )}
/>

<TextField
  label="Apartment, suite, etc. (optional)"
  value={value.street2}
  onChange={(e) => handleFieldChange("street2", e.target.value)}
  fullWidth
  sx={{ mb: 1 }}
/>
            <TextField
                label="City"
                value={value.city}
                onChange={(e) => handleFieldChange("city", e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
                required
            />
            <TextField
                label="Postcode"
                value={value.zip}
                onChange={(e) => handleFieldChange("zip", e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
                required
            />
            <TextField
                label="State"
                value={value.state}
                onChange={(e) => handleFieldChange("state", e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
                required
            />
            <TextField
                label="Country"
                value={value.country}
                onChange={(e) => handleFieldChange("country", e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                required
            />
        </Box>
    );
};

export default AddressForm;