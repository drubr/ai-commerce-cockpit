export const mappingFields = [
  {
    source: "sku",
    label: "Product SKU",
    target: "SupplierPartID",
    required: true,
  },
  {
    source: "name",
    label: "Product name",
    target: "Description",
    required: true,
  },
  { source: "price", label: "Unit price", target: "UnitPrice", required: true },
  { source: "currency", label: "Currency", target: "Currency", required: true },
  {
    source: "unit",
    label: "Unit of measure",
    target: "UnitOfMeasure",
    required: true,
  },
  {
    source: "category",
    label: "Product category",
    target: "Classification",
    required: false,
  },
  {
    source: "image_url",
    label: "Product image",
    target: "ImageURL",
    required: false,
  },
  {
    source: "manufacturer",
    label: "Manufacturer",
    target: "ManufacturerName",
    required: false,
  },
];
export const targetFields = mappingFields.map((field) => field.target);
export const defaultMappings = Object.fromEntries(
  mappingFields.map((field) => [field.source, field.target]),
);
export const mappingStorageKey = "trodat-demo-mappings-v1";
