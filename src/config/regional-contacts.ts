/**
 * ENTIREFM REGIONAL CONTACT & INBOX MATRIX
 * ========================================
 * Structured contact inboxes and regional telephone routing for geographical
 * landing pages, ensuring direct mailto: and tel: conversion architecture.
 */

export interface RegionalContact {
  city: string;
  slug: string;
  email: string;
  emailHref: string;
  phone: {
    display: string;
    href: string;
  };
  regionName: string;
  coverageLabel: string;
}

const REGIONAL_INBOX_MAP: Record<string, Partial<RegionalContact>> = {
  // --- TIER 1 CITIES ---
  london: {
    city: 'London',
    slug: 'london',
    email: 'london@entirefm.com',
    emailHref: 'mailto:london@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Greater London & M25 Commercial Corridor',
    coverageLabel: 'London Regional Operations Desk',
  },
  manchester: {
    city: 'Manchester',
    slug: 'manchester',
    email: 'manchester@entirefm.com',
    emailHref: 'mailto:manchester@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Greater Manchester & North West Corridor',
    coverageLabel: 'North West Operations Desk',
  },
  birmingham: {
    city: 'Birmingham',
    slug: 'birmingham',
    email: 'birmingham@entirefm.com',
    emailHref: 'mailto:birmingham@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'West Midlands Commercial Belt',
    coverageLabel: 'Midlands Operations Desk',
  },
  leeds: {
    city: 'Leeds',
    slug: 'leeds',
    email: 'leeds@entirefm.com',
    emailHref: 'mailto:leeds@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'West Yorkshire Commercial Hub',
    coverageLabel: 'Yorkshire Operations Desk',
  },
  sheffield: {
    city: 'Sheffield',
    slug: 'sheffield',
    email: 'sheffield@entirefm.com',
    emailHref: 'mailto:sheffield@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'South Yorkshire Industrial Corridor',
    coverageLabel: 'South Yorkshire Operations Desk',
  },
  liverpool: {
    city: 'Liverpool',
    slug: 'liverpool',
    email: 'liverpool@entirefm.com',
    emailHref: 'mailto:liverpool@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Merseyside & Estuary Logistics Corridor',
    coverageLabel: 'Merseyside Operations Desk',
  },
  derby: {
    city: 'Derby',
    slug: 'derby',
    email: 'derby@entirefm.com',
    emailHref: 'mailto:derby@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Derbyshire & Advanced Manufacturing Hub',
    coverageLabel: 'East Midlands Operations Desk',
  },
  nottingham: {
    city: 'Nottingham',
    slug: 'nottingham',
    email: 'nottingham@entirefm.com',
    emailHref: 'mailto:nottingham@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Nottinghamshire & East Midlands',
    coverageLabel: 'East Midlands Operations Desk',
  },

  // --- TIER 2 CITIES WITH LIVE ROUTES ---
  oxford: {
    city: 'Oxford',
    slug: 'oxford',
    email: 'oxford@entirefm.com',
    emailHref: 'mailto:oxford@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Oxfordshire & Science Vale Corridor',
    coverageLabel: 'South Regional Operations Desk',
  },
  chesterfield: {
    city: 'Chesterfield',
    slug: 'chesterfield',
    email: 'chesterfield@entirefm.com',
    emailHref: 'mailto:chesterfield@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'North Derbyshire & M1 J29 Corridor',
    coverageLabel: 'Derbyshire Operations Desk',
  },
  doncaster: {
    city: 'Doncaster',
    slug: 'doncaster',
    email: 'doncaster@entirefm.com',
    emailHref: 'mailto:doncaster@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'South Yorkshire & Humber Rail-Freight Hub',
    coverageLabel: 'South Yorkshire Operations Desk',
  },
  rotherham: {
    city: 'Rotherham',
    slug: 'rotherham',
    email: 'rotherham@entirefm.com',
    emailHref: 'mailto:rotherham@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Don Valley Advanced Materials Hub',
    coverageLabel: 'South Yorkshire Operations Desk',
  },
  lincoln: {
    city: 'Lincoln',
    slug: 'lincoln',
    email: 'lincoln@entirefm.com',
    emailHref: 'mailto:lincoln@entirefm.com',
    phone: {
      display: '01522 449 449',
      href: 'tel:01522449449',
    },
    regionName: 'Lincolnshire Commercial & Agricultural Corridor',
    coverageLabel: 'Lincolnshire Regional Operations',
  },
  bradford: {
    city: 'Bradford',
    slug: 'bradford',
    email: 'bradford@entirefm.com',
    emailHref: 'mailto:bradford@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'West Yorkshire Commercial Belt',
    coverageLabel: 'Yorkshire Operations Desk',
  },
  bolton: {
    city: 'Bolton',
    slug: 'bolton',
    email: 'bolton@entirefm.com',
    emailHref: 'mailto:bolton@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Greater Manchester North Corridor',
    coverageLabel: 'North West Operations Desk',
  },
  bury: {
    city: 'Bury',
    slug: 'bury',
    email: 'bury@entirefm.com',
    emailHref: 'mailto:bury@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Greater Manchester M66 Corridor',
    coverageLabel: 'North West Operations Desk',
  },
  preston: {
    city: 'Preston',
    slug: 'preston',
    email: 'preston@entirefm.com',
    emailHref: 'mailto:preston@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Lancashire & M6 Commercial Corridor',
    coverageLabel: 'North West Operations Desk',
  },
  wigan: {
    city: 'Wigan',
    slug: 'wigan',
    email: 'wigan@entirefm.com',
    emailHref: 'mailto:wigan@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Greater Manchester West & M6 Corridor',
    coverageLabel: 'North West Operations Desk',
  },
  grimsby: {
    city: 'Grimsby',
    slug: 'grimsby',
    email: 'grimsby@entirefm.com',
    emailHref: 'mailto:grimsby@entirefm.com',
    phone: {
      display: '01522 449 449',
      href: 'tel:01522449449',
    },
    regionName: 'North East Lincolnshire & Humber Ports',
    coverageLabel: 'Lincolnshire & Humber Operations',
  },
  telford: {
    city: 'Telford',
    slug: 'telford',
    email: 'telford@entirefm.com',
    emailHref: 'mailto:telford@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Shropshire & M54 Industrial Corridor',
    coverageLabel: 'Midlands Operations Desk',
  },
  matlock: {
    city: 'Matlock',
    slug: 'matlock',
    email: 'matlock@entirefm.com',
    emailHref: 'mailto:matlock@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Derbyshire Dales & Peak District Fringe',
    coverageLabel: 'Derbyshire Operations Desk',
  },

  // --- REGIONAL PIPELINE / TRAVEL PATTERNS ---
  hull: {
    city: 'Hull',
    slug: 'hull',
    email: 'hull@entirefm.com',
    emailHref: 'mailto:hull@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'Humber Estuary & East Yorkshire',
    coverageLabel: 'Humber Operations Desk',
  },
  mansfield: {
    city: 'Mansfield',
    slug: 'mansfield',
    email: 'mansfield@entirefm.com',
    emailHref: 'mailto:mansfield@entirefm.com',
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: 'North Nottinghamshire & M1 Corridor',
    coverageLabel: 'East Midlands Operations Desk',
  },
  grantham: {
    city: 'Grantham',
    slug: 'grantham',
    email: 'grantham@entirefm.com',
    emailHref: 'mailto:grantham@entirefm.com',
    phone: {
      display: '01522 449 449',
      href: 'tel:01522449449',
    },
    regionName: 'South Lincolnshire & A1 Corridor',
    coverageLabel: 'Lincolnshire Regional Operations',
  },
  newark: {
    city: 'Newark',
    slug: 'newark',
    email: 'newark@entirefm.com',
    emailHref: 'mailto:newark@entirefm.com',
    phone: {
      display: '01522 449 449',
      href: 'tel:01522449449',
    },
    regionName: 'Nottinghamshire / Lincolnshire Border Corridor',
    coverageLabel: 'Midlands Operations Desk',
  },
  scunthorpe: {
    city: 'Scunthorpe',
    slug: 'scunthorpe',
    email: 'scunthorpe@entirefm.com',
    emailHref: 'mailto:scunthorpe@entirefm.com',
    phone: {
      display: '01522 449 449',
      href: 'tel:01522449449',
    },
    regionName: 'North Lincolnshire Industrial Belt',
    coverageLabel: 'Lincolnshire Regional Operations',
  },
};

/**
 * Retrieve verified regional contact details for a city
 */
export function getRegionalContact(cityOrSlug: string): RegionalContact {
  const normalized = (cityOrSlug || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  
  // Direct match or partial key search
  let matchedKey = Object.keys(REGIONAL_INBOX_MAP).find(k => normalized.includes(k) || k.includes(normalized));
  
  if (matchedKey && REGIONAL_INBOX_MAP[matchedKey]) {
    const item = REGIONAL_INBOX_MAP[matchedKey]!;
    return {
      city: item.city || cityOrSlug,
      slug: matchedKey,
      email: item.email || `${matchedKey}@entirefm.com`,
      emailHref: item.emailHref || `mailto:${matchedKey}@entirefm.com`,
      phone: item.phone || { display: '020 4617 0228', href: 'tel:02046170228' },
      regionName: item.regionName || `${cityOrSlug} & Regional Corridors`,
      coverageLabel: item.coverageLabel || 'Regional Operations Desk',
    };
  }

  // Fallback default
  const cleanCity = cityOrSlug ? cityOrSlug.charAt(0).toUpperCase() + cityOrSlug.slice(1) : 'Regional';
  const inferredSlug = cleanCity.toLowerCase().replace(/\s+/g, '-');
  return {
    city: cleanCity,
    slug: inferredSlug,
    email: `${inferredSlug}@entirefm.com`,
    emailHref: `mailto:${inferredSlug}@entirefm.com`,
    phone: {
      display: '020 4617 0228',
      href: 'tel:02046170228',
    },
    regionName: `${cleanCity} & Surrounding Commercial Areas`,
    coverageLabel: 'Regional Operations Desk',
  };
}

/**
 * Full Email Matrix for Audit & Compliance
 */
export function getRegionalEmailMatrix(): Array<{ city: string; email: string; phone: string; region: string }> {
  return Object.values(REGIONAL_INBOX_MAP).map(c => ({
    city: c.city || '',
    email: c.email || '',
    phone: c.phone?.display || '',
    region: c.regionName || '',
  }));
}
