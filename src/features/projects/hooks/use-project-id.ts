"use client";

import { useParams } from "next/navigation";

export const useProjectId = () => {
  const params = useParams<{ projectId: string }>();
  return params.projectId;
};
