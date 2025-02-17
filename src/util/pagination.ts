export default function ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) {
  return {
    page: page <= 0 ? 1 : page,
    limit: limit <= 0 || limit > 100 ? 20 : limit,
  };
}
