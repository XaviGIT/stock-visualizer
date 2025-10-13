export interface Stock {
  id: string;
  ticker: string;
  exchange: string;
  name: string;
  sector?: string | null;
  category?: string | null;
  price?: string | null;
  shares?: number | null;
  website?: string | null;
  description?: string | null;
  nextEarnings?: string | null;
  lastFullFetch?: string | null;
  createdAt: string;
  updatedAt: string;
}