import type { Metadata } from 'next';
import { getPublicCertification } from '@/server/academy/academy-store';
import { TemplateBadgeVerification } from '@/templates/academy/TemplateBadgeVerification';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export async function generateMetadata(
  props: { params: Promise<{ publicCertId: string }> }
): Promise<Metadata> {
  const { publicCertId } = await props.params;
  const cert = await getPublicCertification(publicCertId);

  if (!cert || !cert.isValid) {
    return {
      title: 'Credential Verification | EntireFM Academy',
      description: 'Official credential verification lookup for EntireFM Academy qualifications.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${cert.recipientName} — ${cert.targetRole} Certified | EntireFM Academy`;
  const description = `Verified EntireFM Academy Credential: ${cert.targetRole} awarded to ${cert.recipientName}. Issued on ${new Date(cert.badgeIssuedAt).toLocaleDateString('en-GB')}.`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/academy/verify/${cert.publicCertId}`,
    },
    openGraph: {
      title,
      description,
      url: `${PRODUCTION_CANONICAL_HOST}/academy/verify/${cert.publicCertId}`,
      siteName: 'EntireFM Academy Credential Registry',
      type: 'profile',
      images: [
        {
          url: `${PRODUCTION_CANONICAL_HOST}/images/editorial/entirefm-client-review-2000w.webp`,
          width: 1200,
          height: 630,
          alt: `${cert.targetRole} Certification — EntireFM Academy`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BadgeVerificationPage(
  props: { params: Promise<{ publicCertId: string }> }
) {
  const { publicCertId } = await props.params;
  const cert = await getPublicCertification(publicCertId);

  return <TemplateBadgeVerification cert={cert} publicCertId={publicCertId} />;
}
