import { requireSession } from "@/lib/session";
import { MappingEditor } from "@/components/dashboard/mapping-editor";
export const metadata = { title: "Field Mapping" };
export default async function FieldMappingPage() {
  await requireSession();
  return <MappingEditor />;
}
