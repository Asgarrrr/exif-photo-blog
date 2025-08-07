import {
  VERCEL_GIT_BRANCH,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
  IS_VERCEL_GIT_PROVIDER_GITHUB,
  IS_DEVELOPMENT,
  APP_CONFIGURATION,
  MATTE_PHOTOS,
  IS_META_DESCRIPTION_CONFIGURED,
  IS_META_TITLE_CONFIGURED,
  HAS_STATIC_OPTIMIZATION,
  GRID_HOMEPAGE_ENABLED,
  AI_CONTENT_GENERATION_ENABLED,
} from '@/app/config';
import { PhotoDateRange } from '@/photo';

const BASIC_PHOTO_INSTALLATION_COUNT = 32;

const AdminAppInsightCode = [
  'noFork',
  'forkBehind',
] as const;
type AdminAppInsightCode = typeof AdminAppInsightCode[number];

const _INSIGHTS_TEMPLATE = [
  'noAi',
  'noAiRateLimiting',
  'noConfiguredDomain',
  'noConfiguredMeta',
  'photoMatting',
  'gridFirst',
  'noStaticOptimization',
] as const;
type AdminAppInsightRecommendation = typeof _INSIGHTS_TEMPLATE[number];

const _INSIGHTS_LIBRARY = [
  'photosNeedSync',
] as const;
type AdminAppInsightLibrary = typeof _INSIGHTS_LIBRARY[number];

export type AdminAppInsight =
  AdminAppInsightRecommendation |
  AdminAppInsightLibrary;

export type AdminAppInsights = Record<AdminAppInsight, boolean>

export type InsightsIndicatorStatus = 'blue' | 'yellow' | undefined;

export const hasTemplateRecommendations = (insights: AdminAppInsights) =>
  _INSIGHTS_TEMPLATE.some(insight => insights[insight]);

export interface PhotoStats {
  photosCount: number
  photosCountHidden: number
  photosCountNeedSync: number
  camerasCount: number
  lensesCount: number
  tagsCount: number
  recipesCount: number
  filmsCount: number
  focalLengthsCount: number
  dateRange?: PhotoDateRange
}

export const getSignificantInsights = ({
  photosCountNeedSync,
}: {
  photosCountNeedSync: number
}) => {
  const {
    isAiTextGenerationEnabled,
    hasRedisStorage,
    hasDomain,
  } = APP_CONFIGURATION;

  return {
    noAiRateLimiting: isAiTextGenerationEnabled && !hasRedisStorage,
    noConfiguredDomain: !hasDomain,
    photosNeedSync: Boolean(photosCountNeedSync),
  };
};

export const indicatorStatusForSignificantInsights = ({
  photosCountNeedSync,
}: Parameters<typeof getSignificantInsights>[0] & {
  photosCountNeedSync: number
}) => {
  const insights = getSignificantInsights({
    photosCountNeedSync,
  });

  const {
    noAiRateLimiting,
    noConfiguredDomain,
    photosNeedSync,
  } = insights;

  if (noAiRateLimiting || noConfiguredDomain) {
    return 'yellow';
  } else if (photosNeedSync) {
    return 'blue';
  }
};

export const getAllInsights = ({
  photosCountNeedSync,
  photosCount,
  photosCountPortrait,
}: Parameters<typeof getSignificantInsights>[0] & {
  photosCount: number
  photosCountPortrait: number
}) => ({
  ...getSignificantInsights({photosCountNeedSync }),
  noAi: !AI_CONTENT_GENERATION_ENABLED,
  noConfiguredMeta:
    !IS_META_TITLE_CONFIGURED ||
    !IS_META_DESCRIPTION_CONFIGURED,
  photoMatting: photosCountPortrait > 0 && !MATTE_PHOTOS,
  gridFirst: (
    photosCount >= BASIC_PHOTO_INSTALLATION_COUNT &&
    !GRID_HOMEPAGE_ENABLED
  ),
  noStaticOptimization: !HAS_STATIC_OPTIMIZATION,
});
