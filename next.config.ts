import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb', // 원하는 용량으로 변경 (예: 5mb, 10mb, 50mb 등)
        },
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
