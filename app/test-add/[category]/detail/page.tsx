'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Selector from '@/components/common/molecules/Selector';
import Input from '@/components/common/atoms/Input';
import Button from '@/components/common/atoms/Button';
import StorySection from '@/components/test-add/StorySection';
import CarouselBar from '@/components/common/molecules/CarouselBar';
import StepNextButton from '@/components/common/molecules/StepNextButton';
import Image from 'next/image';
import Card from '@/components/common/atoms/Card';
import ImageStrip from '@/components/test-add/ImageStrip';
import { useTestAddForm } from '@/hooks/test-add/useTestAddForm';

const PI_OPTIONS = ['이름', '이메일', '연락처', '기타'] as const;
type PI = (typeof PI_OPTIONS)[number];

const UI_TO_API: Record<PI, 'NAME' | 'EMAIL' | 'CONTACT' | 'ETC'> = {
  이름: 'NAME',
  이메일: 'EMAIL',
  연락처: 'CONTACT',
  기타: 'ETC',
};
const API_TO_UI: Record<string, PI> = {
  NAME: '이름',
  EMAIL: '이메일',
  CONTACT: '연락처',
  ETC: '기타',
};

const valueState = (v: string) => (v.trim() ? 'has value' : 'no value');

export default function TestAddSettingPage() {
  const router = useRouter();
  const { category } = useParams<{ category?: string }>();
  const { form, update, save } = useTestAddForm();

  const [piSelected, setPiSelected] = useState<PI | null>(null);
  const [piPurpose, setPiPurpose] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [mediaTab, setMediaTab] = useState<'video' | 'photo'>('video');

  const stepIndex = 9;
  const totalSteps = 10;
  const total = 10;

  useEffect(() => {
    const firstPI = Array.isArray(form.privacyItems) ? form.privacyItems[0] : undefined;
    setPiSelected(firstPI ? (API_TO_UI[firstPI] ?? null) : null);

    setTitle(typeof form.title === 'string' ? form.title : '');
    setSummary(typeof form.serviceSummary === 'string' ? form.serviceSummary : '');
    setVideoUrl(typeof form.mediaUrl === 'string' ? form.mediaUrl : '');
  }, [form.privacyItems, form.title, form.serviceSummary, form.mediaUrl]);

  const onSave = () => {
    const patch: Partial<Parameters<typeof update>[0]> = {
      title: title.trim() || undefined,
      serviceSummary: summary.trim() || undefined,
      privacyItems: piSelected ? [UI_TO_API[piSelected]] : undefined,
      mediaUrl: mediaTab === 'video' && videoUrl.trim() ? videoUrl.trim() : undefined,
    };
    update(patch);
    save();
    alert('임시 저장되었습니다.');
  };

  const onNext = () => {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!summary.trim()) return alert('한 줄 소개를 입력해주세요.');

    const patch: Partial<Parameters<typeof update>[0]> = {
      title: title.trim(),
      serviceSummary: summary.trim(),
      privacyItems: piSelected ? [UI_TO_API[piSelected]] : undefined,
      mediaUrl: mediaTab === 'video' && videoUrl.trim() ? videoUrl.trim() : undefined,
    };
    update(patch);
    router.push(`/test-add/${category}/finish`);
  };

  const handleUpload = (files: FileList) => {
    setImages(prev => [...prev, ...Array.from(files)].slice(0, total));
  };
  const handleRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="w-full px-16 pb-[120px]">
      <section className="w-[1152px] mt-10 mb-8 flex items-center gap-2 rounded-lg bg-Gray-50 p-6">
        <Image src="/beaker.png" alt="Beaker Icon" width={44} height={44} />
        <p className="text-body-01 font-semibold">테스트 등록</p>
      </section>

      <section className="mb-10">
        <p className="mb-2 text-subtitle-01 font-semibold">개인 정보 수집</p>
        <p className="mb-4 text-body-01 font-medium text-Dark-Gray">
          필요한 개인 정보 항목을 선택해주세요.
        </p>

        <Selector<PI> options={PI_OPTIONS} selected={piSelected} onSelect={setPiSelected} />

        <div className="mt-4 pb-5">
          <p className="mb-2 text-body-01 font-semibold">목적</p>
          <Input
            type="text"
            size="xl"
            placeholder="테스트 선정 및 안내에 필요한 개인정보 수집 목적을 간단히 작성해주세요."
            value={piPurpose}
            onChange={e => setPiPurpose(e.currentTarget.value)}
            state={valueState(piPurpose)}
          />
        </div>

        <Card
          title="개인정보 수집 시 유의해주세요"
          items={[
            '불필요한 항목은 요청을 자제해주세요.',
            '수집한 정보는 테스트 목적 외 사용을 금지합니다.',
            '법적 의무 준수를 위해, 테스트 종료 후 즉시 삭제해주세요.',
          ]}
          icon={<Image src="/icons/caution.svg" alt="caution" width={24} height={24} />}
        />
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-subtitle-01 font-semibold">프로젝트 제목</h2>
        <p className="mb-2 text-caption-01 text-Gray-300">
          쉽게 이해할 수 있는 제목을 입력해주세요.
        </p>
        <Input
          type="text"
          size="xl"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
          state={valueState(title)}
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-subtitle-01 font-semibold">프로젝트 간단 설명</h2>
        <p className="mb-2 text-caption-01 text-Gray-300">
          입력한 문장은 상세 페이지의 테스트 개요로 노출돼요.
        </p>
        <Input
          type="text"
          size="xl"
          placeholder="한 줄 소개를 입력해주세요."
          value={summary}
          onChange={e => setSummary(e.currentTarget.value)}
          state={valueState(summary)}
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-subtitle-01 font-semibold">대표 이미지</h2>
        <p className="mb-2 text-caption-01 text-Gray-300">
          프로젝트 성격을 잘 보여주는 이미지를 업로드해주세요.
          <br />이 이미지는 프로젝트 대표로 홈 화면에 노출돼요.
        </p>
        <Card
          title="대표 이미지 등록 가이드"
          items={[
            'JPG, JPEG, PNG 형식 / 10MB 이하 파일만 등록할 수 있어요.',
            '권장 사이즈는 1200x675px (16:9 비율)이에요.',
            '이미지를 업로드한 후, 편집 기능으로 자르거나 조정할 수 있어요.',
            '프로젝트 성격이 잘 드러나는 매력적인 이미지를 선택해주세요.',
          ]}
          icon={<Image src="/icons/road.svg" alt="guide" width={24} height={24} />}
        />
        <div className="mt-3">
          <ImageStrip
            files={images}
            total={total}
            onUpload={handleUpload}
            onRemove={handleRemove}
          />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-subtitle-01 font-semibold">소개 영상 · 사진</h2>
        <p className="mb-3 text-caption-01 text-Gray-300">
          소개 영상 · 사진은 프로젝트 상세페이지 최상단에 노출되는 중요한 영역이에요.
          <br />
          사진과 영상 중 한 가지만 선택할 수 있어요.
        </p>

        <div className="mb-4 flex items-center gap-4">
          <Button
            State={mediaTab === 'video' ? 'Focused' : 'Solid'}
            Size="lg"
            label="소개 영상"
            onClick={() => setMediaTab('video')}
          />
          <Button
            State={mediaTab === 'photo' ? 'Focused' : 'Solid'}
            Size="lg"
            label="소개 사진"
            onClick={() => setMediaTab('photo')}
          />
        </div>

        {mediaTab === 'video' ? (
          <>
            <Card
              title="소개 영상 등록 가이드"
              items={[
                'YouTube, Vimeo 등 영상 스트리밍 서비스에 영상을 업로드한 뒤, 해당 URL을 입력해 주세요.',
                '영상 썸네일은 사용 중인 스트리밍 서비스에서 직접 설정해 주세요.',
                '세로형 영상은 지원되지 않아요. 가로형 영상으로 등록해 주세요.',
              ]}
              icon={<Image src="/icons/road.svg" alt="guide" width={24} height={24} />}
            />
            <div className="mt-6">
              <p className="mb-2 text-body-01 font-semibold">URL</p>
              <Input
                type="text"
                size="xl"
                placeholder="영상 URL을 입력하세요."
                value={videoUrl}
                onChange={e => setVideoUrl(e.currentTarget.value)}
                state={valueState(videoUrl)}
              />
            </div>
          </>
        ) : (
          <>
            <Card
              title="소개 사진 등록 가이드"
              items={[
                'JPG, JPEG, PNG : 용량 10MB 이하, 해상도 800×480 픽셀 이상',
                'GIF : 용량 2MB 이상, 해상도 800×480 픽셀~1440×864',
                '이미지는 최대 10장까지 등록 가능해요.',
                '사진을 통해 설명글을 대신할 수 있어요.',
              ]}
              icon={<Image src="/icons/road.svg" alt="guide" width={24} height={24} />}
            />
            <div className="mt-6">
              <ImageStrip
                files={images}
                total={total}
                onUpload={handleUpload}
                onRemove={handleRemove}
              />
            </div>
          </>
        )}
      </section>

      <section className="mt-8">
        <StorySection />
      </section>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex-1">
          <Button State="Sub" Size="xl" label="임시 저장" onClick={onSave} />
        </div>
        <div className="flex-1 flex justify-center">
          <CarouselBar activeIndex={stepIndex} total={totalSteps} />
        </div>
        <div className="flex-1 flex justify-end">
          <StepNextButton onClick={onNext} />
        </div>
      </div>
    </main>
  );
}
