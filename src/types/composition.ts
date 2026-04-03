import type { AtomRole } from "./atom";

export interface AtomEntry {
  slug: string;        // References atom-registry slug (e.g. "glow-surface")
  type: AtomRole;      // Atom role category
  role: string;        // What it does in this specific component
  shared?: boolean;    // true = reused from a prior component
}

export interface ContainerSpec {
  role: string;        // What the component does
  layout: string;      // Layout strategy description
  state: string[];     // State variables managed by the container
}

export interface CompositionMap {
  container: ContainerSpec;
  atoms: AtomEntry[];
}
