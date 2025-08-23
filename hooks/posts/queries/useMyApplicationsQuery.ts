import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { GetMyApplicationsRequestType, GetMyApplicationsResponseType } from '../dto/myApplications';
import { instance } from '@/apis/instance';

const BASE_PATH = '/v1/users/posts/applications';

const getMyApplications = async (
  params: GetMyApplicationsRequestType,
): Promise<GetMyApplicationsResponseType> => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  if (params.size !== undefined) {
    searchParams.append('size', params.size.toString());
  }
  if (params.sort && params.sort.length > 0) {
    params.sort.forEach(sort => searchParams.append('sort', sort));
  }

  const response = await instance.get(`${BASE_PATH}?${searchParams.toString()}`);
  return response.data;
};

export const useMyApplicationsQuery = (
  params: GetMyApplicationsRequestType = { page: 0, size: 9 },
): UseQueryResult<GetMyApplicationsResponseType> => {
  return useQuery({
    queryKey: ['myApplications', params],
    queryFn: () => getMyApplications(params),
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
