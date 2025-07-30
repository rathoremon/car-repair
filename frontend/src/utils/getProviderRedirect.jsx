export default function getProviderRedirect(user) {
  if (!user || !user.provider) return "/provider/pending";
  if (!user.onboardingComplete) return "/onboarding";
  if (user.provider.kycStatus === "pending" || !user.provider.kycStatus)
    return "/provider/pending";
  if (user.provider.kycStatus === "verified") return "/provider/dashboard";
  if (user.provider.kycStatus === "rejected") return "/onboarding";
  return "/provider/dashboard";
}
