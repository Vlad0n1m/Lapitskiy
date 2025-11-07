module.exports = {
    images: {
        remotePatterns: [{
            protocol: 'http', hostname: '127.0.0.1', port: '1337',
        }, {
            protocol: 'http', hostname: 'localhost', port: '1337',
        }, {
            protocol: 'https', hostname: 'growing-bloom-a96956901b.strapiapp.com',
        }, {
            protocol: 'http', hostname: 'growing-bloom-a96956901b.strapiapp.com',
        }, {
            protocol: 'https', hostname: 'growing-bloom-a96956901b.media.strapiapp.com',
        }, {
            protocol: 'https',
            hostname: '**.public.blob.vercel-storage.com',
        }],
    },
}