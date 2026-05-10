import { getCampusTypes } from "@/app/actions/campus-type";
import CampusTypeManager from "./CampusTypeManager";

export default async function CampusTypePage() {
  const campusTypes = await getCampusTypes();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Campus Types</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Define types for your branches (e.g., Bağımsız, Okul) for filtering and categorization.
        </p>
      </div>

      <CampusTypeManager initialTypes={JSON.parse(JSON.stringify(campusTypes))} />
    </div>
  );
}
