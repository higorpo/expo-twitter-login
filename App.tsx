import { exchangeCodeAsync, makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

const useProxy = Platform.select({ web: false, default: true });

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
    tokenEndpoint: "https://api.twitter.com/2/oauth2/token",
    revocationEndpoint: "https://api.twitter.com/2/oauth2/revoke",
};

export default function App() {
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: Constants.expoConfig?.extra?.TWITTER_CLIENT_ID || '',
            redirectUri: makeRedirectUri({
                useProxy
            }),
            codeChallenge: 'dailyfriend',
            scopes: [
                "tweet.read",
                "tweet.write",
                "users.read",
                "follows.read",
                "offline.access",
                "block.read"
            ],
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            requestToken(code);
        }
    }, [response]);

    async function requestToken(code: string) {
        const { accessToken, scope, expiresIn, refreshToken } = await exchangeCodeAsync({
            code,
            clientId: Constants.expoConfig?.extra?.TWITTER_CLIENT_ID || '',
            redirectUri: makeRedirectUri({
                useProxy
            }),
            extraParams: {
                code_verifier: request?.codeVerifier || '',
            }
        }, discovery);

        console.log('accessToken: ', accessToken);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Let's sign in using your Twitter account.</Text>

            <Button
                disabled={!request}
                title="Sign In with Twitter"
                onPress={() => {
                    promptAsync({ useProxy });
                }}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});
