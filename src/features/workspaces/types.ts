/* eslint-disable @typescript-eslint/no-explicit-any */
export type Workspace = {
  [x: string]: any;
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
};
