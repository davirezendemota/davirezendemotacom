/**
 * Lista de projetos para a área de Projetos.
 * nameKey corresponde às chaves em messages/*.json sob "projetos.titles.<id>".
 * icon é o nome do ícone Lucide (disponível para uso na UI).
 */
export type ProjectIconName =
  | "Code2"
  | "Globe"
  | "Smartphone"
  | "Database"
  | "Layers"
  | "Server";

export interface Project {
  id: string;
  nameKey: string;
  descriptionKey: string;
  date: string;
  icon: ProjectIconName;
  /** Caminho da imagem (ex: /projetos/thumb-1.jpg). Opcional. */
  image?: string;
  /** URL externa do projeto. Opcional. */
  url?: string;
}

export const projetos: Project[] = [
  { id: "rm-dashboard", nameKey: "rm-dashboard", descriptionKey: "rm-dashboard", date: "2024-01", icon: "Layers" },
  { id: "portfolio", nameKey: "portfolio", descriptionKey: "portfolio", date: "2024-06", icon: "Globe" },
  { id: "api-gateway", nameKey: "api-gateway", descriptionKey: "api-gateway", date: "2023-11", icon: "Server" },
  { id: "mobile-app", nameKey: "mobile-app", descriptionKey: "mobile-app", date: "2024-03", icon: "Smartphone" },
];
