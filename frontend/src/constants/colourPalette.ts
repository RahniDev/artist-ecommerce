export type PaintColor = {
  name: string;
  hex: string;
  finish:
    | "Transparent"
    | "Transparent / Granulating"
    | "Semi-Opaque"
    | "Opaque / Heavily Granulating";
};

export const PAINT_COLOR_OPTIONS: PaintColor[] = [
  // TRANSPARENT
  {
    name: "Nickel Azo Yellow",
    hex: "#C79B1B",
    finish: "Transparent"
  },
  {
    name: "Indian Yellow",
    hex: "#D89B18",
    finish: "Transparent"
  },
  {
    name: "Quinacridone Gold",
    hex: "#B9781E",
    finish: "Transparent"
  },
  {
    name: "Quinacridone Rose",
    hex: "#B94874",
    finish: "Transparent"
  },
  {
    name: "Permanent Magenta",
    hex: "#A3275A",
    finish: "Transparent"
  },
  {
    name: "Quinacridone Burnt Orange",
    hex: "#A14F2A",
    finish: "Transparent"
  },
  {
    name: "Transparent Red Oxide",
    hex: "#8F4A2A",
    finish: "Transparent"
  },
  {
    name: "Perylene Maroon",
    hex: "#4F1F24",
    finish: "Transparent"
  },
  {
    name: "Perylene Violet",
    hex: "#4A314B",
    finish: "Transparent"
  },
  {
    name: "Perylene Green",
    hex: "#2E3A2C",
    finish: "Transparent"
  },
  {
    name: "Dioxazine Purple",
    hex: "#5B3C88",
    finish: "Transparent"
  },
  {
    name: "Indanthrone Blue",
    hex: "#24395E",
    finish: "Transparent"
  },
  {
    name: "Rich Green Gold",
    hex: "#7A6B23",
    finish: "Transparent"
  },
  {
    name: "Quinacridone Lilac",
    hex: "#B78AAE",
    finish: "Transparent"
  },
  {
    name: "Phthalo Blue (Green Shade)",
    hex: "#0F5FA8",
    finish: "Transparent"
  },
  {
    name: "Phthalo Green (Blue Shade)",
    hex: "#0F6A5B",
    finish: "Transparent"
  },
  {
    name: "Quinacridone Coral",
    hex: "#D66A5E",
    finish: "Transparent"
  },
  {
    name: "Pyrrol Scarlet",
    hex: "#B9382F",
    finish: "Transparent"
  },
  {
    name: "Anthraquinoid Red",
    hex: "#7E2946",
    finish: "Transparent"
  },
  {
    name: "Undersea Green",
    hex: "#465B42",
    finish: "Transparent"
  },

  // TRANSPARENT / GRANULATING
  {
    name: "French Ultramarine",
    hex: "#4056A1",
    finish: "Transparent / Granulating"
  },
  {
    name: "Prussian Blue",
    hex: "#223A5E",
    finish: "Transparent / Granulating"
  },
  {
    name: "Terre Verte",
    hex: "#7C8A63",
    finish: "Transparent / Granulating"
  },
  {
    name: "Raw Sienna",
    hex: "#B9854B",
    finish: "Transparent / Granulating"
  },
  {
    name: "Yellow Ochre",
    hex: "#B08A3E",
    finish: "Transparent / Granulating"
  },
  {
    name: "Goethite Brown Ochre",
    hex: "#8B6A3E",
    finish: "Transparent / Granulating"
  },
  {
    name: "Venetian Red",
    hex: "#9E4A3A",
    finish: "Transparent / Granulating"
  },
  {
    name: "Indian Red",
    hex: "#7E3F3A",
    finish: "Transparent / Granulating"
  },
  {
    name: "Cobalt Teal",
    hex: "#5C9FA1",
    finish: "Transparent / Granulating"
  },
  {
    name: "Cobalt Blue",
    hex: "#5B78B5",
    finish: "Transparent / Granulating"
  },
  {
    name: "Viridian Hue",
    hex: "#4E8B72",
    finish: "Transparent / Granulating"
  },
  {
    name: "Cerulean Blue Chromium",
    hex: "#6A9DBE",
    finish: "Transparent / Granulating"
  },
  {
    name: "Burnt Sienna",
    hex: "#8F533A",
    finish: "Transparent / Granulating"
  },

  // SEMI-OPAQUE
  {
    name: "Naples Yellow",
    hex: "#DCC58A",
    finish: "Semi-Opaque"
  },
  {
    name: "Buff Titanium",
    hex: "#D8C9B1",
    finish: "Semi-Opaque"
  },
  {
    name: "Moonglow",
    hex: "#5E5B6E",
    finish: "Semi-Opaque"
  },
  {
    name: "Shadow Violet",
    hex: "#64556B",
    finish: "Semi-Opaque"
  },
  {
    name: "Ultramarine Violet Pink Shade",
    hex: "#8C6D8E",
    finish: "Semi-Opaque"
  },
  {
    name: "Jaune Brilliant No. 1",
    hex: "#E8B98F",
    finish: "Semi-Opaque"
  },
  {
    name: "Mineral Violet",
    hex: "#7A6A83",
    finish: "Semi-Opaque"
  },
  {
    name: "Lavender",
    hex: "#B8B0D9",
    finish: "Semi-Opaque"
  },
  {
    name: "Green Gold",
    hex: "#9A9435",
    finish: "Semi-Opaque"
  },

  // OPAQUE / HEAVILY GRANULATING
  {
    name: "Potters Pink",
    hex: "#C9A7A3",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Tundra Violet",
    hex: "#7C6B78",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Sodalite Genuine",
    hex: "#435A74",
    finish: "Opaque / Heavily Granulating",
  },
  {
    name: "Kyanite Genuine",
    hex: "#6E88A8",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Lunar Blue",
    hex: "#33485F",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Lunar Black",
    hex: "#2A2A2A",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Green Apatite Genuine",
    hex: "#5E6F4D",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Serpentine Genuine",
    hex: "#7F8B4E",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Cascade Green",
    hex: "#567A66",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Lunar Earth",
    hex: "#7B5C48",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Hematite Genuine",
    hex: "#5B4E4A",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Bloodstone Genuine",
    hex: "#4E3B33",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Graphite Grey",
    hex: "#676767",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Piemontite Genuine",
    hex: "#8A6A72",
    finish: "Opaque / Heavily Granulating"
  },
  {
    name: "Burgundy Yellow Ochre",
    hex: "#9B7A4B",
    finish: "Opaque / Heavily Granulating"
  }
];