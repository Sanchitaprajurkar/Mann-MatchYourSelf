import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  url,
  image,
  noindex = false,
  structuredData,
}) => {
  const location = useLocation();
  
  // Default values
  const siteTitle = 'Mann Match Yourself';
  const siteDescription = 'Discover exquisite ethnic wear and contemporary fashion at Mann Match Yourself. Shop our curated collection of sarees, lehengas, and designer apparel.';
  const siteKeywords = 'Mann Match Yourself, ethnic wear, sarees, lehengas, designer clothing, fashion, indian wear, contemporary fashion';
  const siteUrl = 'https://www.mannmatchyourself.com';
  const defaultImage = '/og-image.jpg';
  
  // Build full URLs
  const currentUrl = url || `${siteUrl}${location.pathname}`;
  const currentImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}${defaultImage}`;
  
  // Build page title
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || siteDescription;
  const pageKeywords = keywords || siteKeywords;
  
  // Build robots meta
  const robotsContent = noindex ? 'noindex,nofollow' : 'index,follow';
  
  // Structured data
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    description: siteDescription,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  
  const finalStructuredData = structuredData || defaultStructuredData;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={currentImage} />
      <meta property="og:image:alt" content={title || siteTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={currentImage} />
      <meta name="twitter:image:alt" content={title || siteTitle} />
      
      {/* Additional Meta Tags */}
      <meta name="language" content="English" />
      <meta name="author" content="Mann Match Yourself" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
