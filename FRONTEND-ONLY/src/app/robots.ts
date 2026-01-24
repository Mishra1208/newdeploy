import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/login/', '/sign-in/', '/sign-up/', '/playground/'],
            },
        ],
        sitemap: 'https://conuplanner.com/sitemap.xml',
    }
}
