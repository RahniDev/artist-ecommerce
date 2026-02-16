import React, { useState } from "react";
import { TextField, Autocomplete, Box } from "@mui/material";
import type {Address, PhotonPlace} from '../types';

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
    const { name, city, postcode, country } = place.properties;
    const full = [name, city, postcode, country].filter(Boolean).join(", ");
    onChange({ street: name ?? "", city: city ?? "", postcode: postcode ?? "", country: country ?? "", full });
    setSuggestions([]);
  };

  const handleFieldChange = (field: keyof Address, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Autocomplete
        freeSolo
        options={suggestions}
        getOptionLabel={(option) => {
          if ("properties" in option) {
            const { name, city, postcode, country } = option.properties;
            return [name, city, postcode, country].filter(Boolean).join(", ");
          }
          return option as string;
        }}
        onInputChange={(e, value) => handleAutocompleteInput(value)}
        onChange={(e, value) => value && "properties" in value && handleSelectSuggestion(value)}
        renderInput={(params) => (
          <TextField {...params} label="Delivery Address" placeholder="Start typing your address..." fullWidth />
        )}
      />

      <TextField
        label="Street"
        value={value.street}
        onChange={(e) => handleFieldChange("street", e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />
      <TextField
        label="City"
        value={value.city}
        onChange={(e) => handleFieldChange("city", e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />
      <TextField
        label="Postcode"
        value={value.postcode}
        onChange={(e) => handleFieldChange("postcode", e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />
      <TextField
        label="Country"
        value={value.country}
        onChange={(e) => handleFieldChange("country", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default AddressForm;