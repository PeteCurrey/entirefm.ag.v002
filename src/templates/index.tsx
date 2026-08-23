import React from 'react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import { loadContentRecord } from '@/content';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageGraph } from '@/lib/seo/page-schema';
import { TemplateHome } from './TemplateHome';
import { TemplateCoreService } from './TemplateCoreService';
import { TemplateSpecialistService } from './TemplateSpecialistService';
import { TemplateSector } from './TemplateSector';
import { TemplatePrimaryLocation } from './TemplatePrimaryLocation';
import { TemplateSecondaryLocation } from './TemplateSecondaryLocation';
import { TemplateThirdLocation } from './TemplateThirdLocation';
import { TemplateLocalService } from './TemplateLocalService';
import { TemplateHub } from './TemplateHub';
import { TemplateCaseStudy } from './TemplateCaseStudy';
import { TemplateArticle } from './TemplateArticle';
import { TemplateAbout } from './TemplateAbout';
import { TemplateContact } from './TemplateContact';
import { TemplateLegal } from './TemplateLegal';
import { TemplateCareers } from './TemplateCareers';
import { TemplateHelpdesk } from './TemplateHelpdesk';
import { TemplateSupplyChain } from './TemplateSupplyChain';
import { TemplateHtmlSitemap } from './TemplateHtmlSitemap';
import { TemplateComplianceHub, TemplateComplianceTopic } from './TemplateCompliance';
import { TemplateGlossaryNational } from './TemplateGlossaryNational';
import { TemplateGlossaryLocation } from './TemplateGlossaryLocation';
import { LOCATION_GLOSSARY_DATA } from '@/data/glossary/location-terms';
import { ServiceMechanicalElectrical } from './services/ServiceMechanicalElectrical';
import { ServiceHvac } from './services/ServiceHvac';
import { ServicePpm } from './services/ServicePpm';
import { ServiceIndustrialCleaning } from './services/ServiceIndustrialCleaning';

export function resolvePageTemplate(route: RouteRecord): React.ReactElement {
  const content = loadContentRecord(route.path);

  if (!content) {
    throw new Error(
      `MISSING_PROTECTED_PAGE_CONTENT: No valid ContentRecord found for registered route "${route.path}". Every route requires an explicit content record.`
    );
  }

  // Every page carries structured data. Selecting the template and describing
  // it to search engines are the same decision, so they happen in one place.
  return (
    <>
      <JsonLd graph={buildPageGraph(route, content)} />
      {selectTemplate(route, content)}
    </>
  );
}

function selectTemplate(
  route: RouteRecord,
  content: ContentRecord
): React.ReactElement {
  const path = route.path;

  // 1. Homepage
  if (path === '/') {
    return <TemplateHome />;
  }

  // 2. HTML Sitemap
  if (path === '/html-sitemap' || path === '/sitemap') {
    return <TemplateHtmlSitemap />;
  }

  // 3. Legal Routes
  if (
    route.routeType === 'legal' ||
    path === '/privacy-policy' ||
    path === '/terms-and-conditions' ||
    path === '/accessibility-statement'
  ) {
    return <TemplateLegal route={route} content={content} />;
  }

  // 4. Careers Routes
  if (
    path === '/careers' ||
    path === '/job-board' ||
    path === '/employment-portal'
  ) {
    return <TemplateCareers route={route} content={content} />;
  }

  // 5. Helpdesk & Portal Routes
  if (
    path === '/helpdesk' ||
    path === '/helpdesk-registration' ||
    path === '/fm-client-info' ||
    path === '/copy-of-helpdesk-registration' ||
    path === '/client-login' ||
    path === '/client-login/account-registration'
  ) {
    return <TemplateHelpdesk route={route} content={content} />;
  }

  // 6. Supply Chain & Marketplace
  if (
    path === '/fm-supply-chain' ||
    path === '/fm-supply-form' ||
    path === '/marketplace'
  ) {
    return <TemplateSupplyChain route={route} content={content} />;
  }

  // 6b. Compliance Centre
  if (path === '/compliance') {
    return <TemplateComplianceHub route={route} content={content} />;
  }
  if (path.startsWith('/compliance/')) {
    return <TemplateComplianceTopic route={route} content={content} />;
  }

  // 6c. Facilities Management Glossary Estate
  if (path === '/facilities-management-glossary') {
    return <TemplateGlossaryNational />;
  }
  if (path.startsWith('/facilities-management-glossary-')) {
    const citySlug = path.replace('/facilities-management-glossary-', '');
    const locationData = LOCATION_GLOSSARY_DATA[citySlug];
    if (locationData) {
      return <TemplateGlossaryLocation data={locationData} />;
    }
  }

  // 7. Directory Hub Pages
  if (
    path === '/services' ||
    path === '/sectors' ||
    path === '/locations' ||
    path === '/items' ||
    path === '/resources'
  ) {
    return <TemplateHub route={route} content={content} />;
  }

  // 8. Case Studies & Portfolio
  if (path === '/case-studies' || path === '/portfolio') {
    return <TemplateCaseStudy route={route} content={content} />;
  }

  // 9. Contact Routes
  if (path === '/contact-us' || path === '/fm-support-n-contact') {
    return <TemplateContact />;
  }

  // 10. About & Corporate Information
  if (
    path === '/about-entire-facilities-management' ||
    path === '/facilities-management-team' ||
    path === '/best-facilities-management-company'
  ) {
    return <TemplateAbout route={route} content={content} />;
  }

  // 11. Blog, Post & Glossary Articles
  if (
    route.routeType === 'post' ||
    path.startsWith('/post/') ||
    path === '/what-is-facilities-management' ||
    path === '/blog' ||
    path === '/facilities-management-blog' ||
    path === '/copy-of-what-is-facilities-manageme' ||
    path === '/fm-support-n-contact/facilities-management-glossary'
  ) {
    return <TemplateArticle route={route} content={content} />;
  }

  // 12. City Differentiation Clusters (London, Manchester, Birmingham, Leeds, Sheffield, Lincoln)
  if (
    path === '/fm-london' ||
    path === '/fm-manchester' ||
    path === '/fm-birmingham' ||
    path === '/fm-leeds'
  ) {
    return <TemplatePrimaryLocation route={route} content={content} />;
  }

  if (
    path === '/facilities-management-london' ||
    path === '/facilities-management-manchester' ||
    path === '/facilities-management-birmingham' ||
    path === '/facilities-management-leeds' ||
    path === '/facilities-management-sheffield' ||
    path === '/facilities-management-chesterfield' ||
    path === '/facilities-management-lincoln'
  ) {
    return <TemplateSecondaryLocation route={route} content={content} />;
  }

  if (
    path === '/london-facilities-management' ||
    path === '/manchester-facilities-management' ||
    path === '/birmingham-facilities-management' ||
    path === '/leeds-facilities-management'
  ) {
    return <TemplateThirdLocation route={route} content={content} />;
  }

  // 13. Sector Routes
  if (route.routeType === 'sector') {
    return <TemplateSector route={route} content={content} />;
  }

  // 14. Geographic Local Services
  if (
    route.routeType === 'geographic-service' ||
    path.startsWith('/commercial-fm-lincoln') ||
    path.startsWith('/industrial-fm-lincoln') ||
    path.startsWith('/residential-fm-lincoln') ||
    path.startsWith('/retail-fm-lincoln') ||
    path.includes('-cleaning-') ||
    path.includes('-facilities-management-')
  ) {
    return <TemplateLocalService route={route} content={content} />;
  }

  // 15. General Location Routes
  if (route.routeType === 'location') {
    return <TemplatePrimaryLocation route={route} content={content} />;
  }

  // 16. Services (Specialist vs Core M&E vs Dedicated Prototypes)
  if (route.routeType === 'service') {
    if (path === '/mechanical-electrical') {
      return <ServiceMechanicalElectrical route={route} content={content} />;
    }
    if (path === '/hvac-contractor') {
      return <ServiceHvac route={route} content={content} />;
    }
    if (path === '/ppm') {
      return <ServicePpm route={route} content={content} />;
    }
    if (path === '/industrial-cleaning') {
      return <ServiceIndustrialCleaning route={route} content={content} />;
    }
    if (
      path.includes('cleaning') ||
      path.includes('washing') ||
      path.includes('crane') ||
      path.includes('mobile-crane')
    ) {
      return <TemplateSpecialistService route={route} content={content} />;
    }
    return <TemplateCoreService route={route} content={content} />;
  }

  // Default fallback for any remaining registered route
  return <TemplateCoreService route={route} content={content} />;
}
