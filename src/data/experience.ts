export type Beat = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** The single number worth reading. Kept out of prose deliberately. */
  metric: string;
};

export type Role = {
  company: string;
  title: string;
  period: string;
  beats: Beat[];
};

export const experience: Role[] = [
  {
    company: "Tech Mahindra",
    title: "Data Engineering & Analytics Intern",
    period: "May 2026 — Jul 2026",
    beats: [
      {
        id: "ingestion",
        label: "Ingestion",
        title: "Heterogeneous sources, one shape",
        body: "Built ingestion for datasets arriving in three-plus file formats, normalising them into a single working schema before anything downstream touched them.",
        metric: "~30% less manual preprocessing",
      },
      {
        id: "transformation",
        label: "Transformation",
        title: "Reusable SQL and Spark",
        body: "Wrote transformations over telecom datasets as reusable units rather than one-off scripts, so the same logic served more than one report.",
        metric: "100K+ records",
      },
      {
        id: "quality",
        label: "Quality",
        title: "Fail at the edge, not the dashboard",
        body: "Added schema validation and missing-value handling at pipeline boundaries, so malformed records were caught on entry instead of surfacing as wrong numbers later.",
        metric: "~20% fewer downstream errors",
      },
      {
        id: "delivery",
        label: "Delivery",
        title: "Numbers people actually opened",
        body: "Delivered Power BI dashboards covering churn KPIs, revenue trends and retention, built against the cleaned tables the pipeline produced.",
        metric: "3 dashboards",
      },
    ],
  },
];
