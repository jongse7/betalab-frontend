import { ConditionProps } from "@/components/common/atoms/Condition";
import { ProjectDataModel } from '@/hooks/posts/dto/postDetail';
import { ApplyCardProps } from '@/components/common/molecules/ApplyCard';

export const mockProjectData: ProjectDataModel = {
  id: 1,
  title: '더미 프로젝트 제목',
  serviceSummary: '서비스 요약 내용입니다.',
  creatorIntroduction: '창작자 소개 내용입니다.',
  description: '프로젝트 설명입니다. 프로젝트 설명입니다. 프로젝트 설명입니다.',
  thumbnailUrl: undefined,
  mainCategories: [
    { code: 'CAT001', name: '기술' },
    { code: 'CAT002', name: '교육' },
  ],
  platformCategories: [
    { code: 'PLT001', name: '웹' },
    { code: 'PLT002', name: '모바일' },
  ],
  genreCategories: [
    { code: 'GEN001', name: '연구' },
  ],
  status: 'ACTIVE',
  qnaMethod: '카카오톡 오픈채팅',
  likeCount: 123,
  viewCount: 4567,
  currentParticipants: 30,
  schedule: {
    startDate: '2025-09-01T00:00:00Z',
    endDate: '2025-09-30T23:59:59Z',
    recruitmentDeadline: '2025-08-31T23:59:59Z',
    durationTime: '1개월',
  },
  requirement: {
    maxParticipants: 50,
    genderRequirement: '무관',
    ageMin: 18,
    ageMax: 65,
    additionalRequirements: '특별한 요구사항 없음',
  },
  reward: {
    rewardType: 'CASH',
    rewardDescription: '참여자에게 현금 5만원 지급',
  },
  feedback: {
    feedbackMethod: '온라인 설문조사',
    feedbackItems: ['사용성', '만족도', '기능 개선점'],
    privacyItems: ['NAME', 'EMAIL'],
  },
  content: {
    participationMethod: '웹사이트에서 신청',
    storyGuide: '참여 스토리 안내 문구입니다.',
    mediaUrl: undefined,
  },
  createdAt: '2025-07-01T12:00:00Z',
  createdBy: 1001,
  isLiked: true,
  isParticipated: false,
}

const conditions: ConditionProps[] = [
  {
    style: 'reward',
    texts: [mockProjectData.reward.rewardDescription], // '참여자에게 현금 5만원 지급'
  },
  {
    style: 'date',
    texts: [
      `시작일: ${new Date(mockProjectData.schedule.startDate).toLocaleDateString()}`,
      `종료일: ${new Date(mockProjectData.schedule.endDate).toLocaleDateString()}`,
      `모집마감: ${new Date(mockProjectData.schedule.recruitmentDeadline).toLocaleDateString()}`,
      `기간: ${mockProjectData.schedule.durationTime}`,
    ],
  },
  {
    style: 'route',
    texts: [mockProjectData.content.participationMethod], // '웹사이트에서 신청'
  },
  {
    style: 'user condition',
    texts: [
      `최대 참여자: ${mockProjectData.requirement.maxParticipants}명`,
      `성별: ${mockProjectData.requirement.genderRequirement}`,
      `연령: ${mockProjectData.requirement.ageMin}세 ~ ${mockProjectData.requirement.ageMax}세`,
      mockProjectData.requirement.additionalRequirements,
    ],
  },
  {
    style: 'qna',
    texts: [mockProjectData.qnaMethod], // '카카오톡 오픈채팅'
  },
];

export const applyCardData: Omit<ApplyCardProps, 'scrapClicked' | 'registerClicked'> = {
  title: mockProjectData.title, // '더미 프로젝트 제목'
  profile: {
    name: '창작자 이름 예시', // mockProjectData.creatorIntroduction에서 따로 빼거나, 별도로 지정 필요
    affiliation: '소속 예시', // 이 정보가 없으면 빈 문자열 또는 추가 데이터 필요
    imageUrl: mockProjectData.thumbnailUrl, // 대표 이미지 URL
  },
  description: mockProjectData.description,
  endDate: new Date(mockProjectData.schedule.endDate), // Date 타입으로 변환 필요
  scrapedNumber: mockProjectData.likeCount, // 좋아요 수를 스크랩 수로 가정
  conditions: conditions, // ConditionProps 배열인데, 별도 매핑/생성 필요 (아래 참고)
  attendees: mockProjectData.currentParticipants,
  scraped: mockProjectData.isLiked,
};