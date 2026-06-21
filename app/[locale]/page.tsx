import { SearchPageContent } from '@/components/SearchPage/SearchPageContent';

type Props = {
  searchParams: Promise<{ page?: string; details?: string; q?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page || '1';
  const detailsId = params.details || undefined;
  const query = params.q || '';

  return <SearchPageContent page={page} detailsId={detailsId} query={query} />;
}