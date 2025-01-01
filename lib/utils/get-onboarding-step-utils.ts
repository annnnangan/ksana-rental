export function getOnboardingStep(pagePath: string): string | null {
  const match = pagePath.match(/\/onboarding\/([^/]+)/);
  return match ? match[1] : null;
}
