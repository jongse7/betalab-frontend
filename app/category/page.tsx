'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/category/molecules/Sidebar';
import Tabbar from '@/components/category/molecules/Tabbar';
import { useCategoryStore } from '@/stores/categoryStore';
import { usePagination } from '@/hooks/usePagination';
import Button from '@/components/common/atoms/Button';
import Pagination from '@/components/category/molecules/Pagination';
import PostCard, { PostCardSkeleton } from '@/components/category/molecules/PostCard';
import { useUsersPostsListQuery } from '@/hooks/posts/queries/useUsersPostsListQuery';
import { createApiParams } from '@/app/category/const';
import PopularPage from './popular/page';

function CategoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mainCategory, genreCategory, platformCategory, initializeFromURL } = useCategoryStore();
  const { currentPage, pageSize, setCurrentPage, setTotalPages, setTotalElements } =
    usePagination();

  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    initializeFromURL(searchParams);
  }, [searchParams, initializeFromURL]);

  useEffect(() => {
    if (mainCategory === '인기순위') {
      router.push('/category/popular?category=all', { scroll: false });
    }
  }, [mainCategory, router]);

  const {
    data: postsData,
    isLoading,
    error,
  } = useUsersPostsListQuery({
    ...createApiParams(mainCategory, platformCategory, genreCategory),
    ...(keyword && { keyword }),
    page: currentPage - 1,
    size: pageSize,
  });

  useEffect(() => {
    if (postsData) {
      setTotalPages(postsData.totalPages);
      setTotalElements(postsData.totalElements);
    }
  }, [postsData, setTotalPages, setTotalElements]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [mainCategory, genreCategory, platformCategory, keyword, setCurrentPage]);

  useEffect(() => {
    if (error) {
      router.push('/');
    }
  }, [error, router]);

  if (mainCategory === '인기순위') {
    return <PopularPage />;
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Tabbar className="px-16 py-5" />
        <main className="flex pb-30 flex-row py-5 px-16 items-start justify-start gap-10">
          <Sidebar />
          <section className="flex flex-col items-center gap-10">
            <div className="text-center text-red-500">
              인증이 필요합니다. 홈페이지로 이동합니다.
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Tabbar className="px-16 py-5" />
      <main className="flex pb-30 flex-row py-10 px-16 items-start justify-start gap-10">
        <Sidebar />
        <section className="flex flex-col items-center gap-10">
          <div className="grid grid-cols-3 gap-x-4 gap-y-10 w-full">
            {isLoading
              ? Array.from({ length: 12 }, (_, index) => <PostCardSkeleton key={index} />)
              : postsData?.content.map(post => <PostCard key={post.id} post={post} />)}
          </div>

          {postsData && postsData.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={postsData.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </main>
      <Button
        onClick={() => router.push('/test-add')}
        className="fixed bottom-[30px] right-[31px] cursor-pointer"
        label="테스트 등록"
        Size="xxl"
        State="Primary"
      />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPageContent />
    </Suspense>
  );
}
