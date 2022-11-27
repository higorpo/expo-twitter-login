import * as dotenv from 'dotenv';
dotenv.config();

import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    slug: 'twitter-integration-test',
    name: 'twitter-integration-test',
    extra: {
        "TWITTER_CLIENT_ID": process.env.TWITTER_CLIENT_ID,
        "TWITTER_CLIENT_SECRET": process.env.TWITTER_CLIENT_SECRET,
    }
});