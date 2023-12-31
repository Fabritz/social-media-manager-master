/* tslint:disable */
/* eslint-disable */
/**
 * SNS-Manager API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  ErrorMessage,
  OAuthToken,
  RefreshToken,
  SNSPostResponse,
  Token,
  UnprocessableEntity,
  UpvotedResponse,
  User,
} from '../models';
import {
    ErrorMessageFromJSON,
    ErrorMessageToJSON,
    OAuthTokenFromJSON,
    OAuthTokenToJSON,
    RefreshTokenFromJSON,
    RefreshTokenToJSON,
    SNSPostResponseFromJSON,
    SNSPostResponseToJSON,
    TokenFromJSON,
    TokenToJSON,
    UnprocessableEntityFromJSON,
    UnprocessableEntityToJSON,
    UpvotedResponseFromJSON,
    UpvotedResponseToJSON,
    UserFromJSON,
    UserToJSON,
} from '../models';

export interface RedditAuthGetRequest {
    returnTo?: string;
}

export interface RedditPostPostPostRequest {
    subreddit: string;
    title: string;
    flair?: string;
    images?: Array<Blob>;
    text?: string;
}

export interface RedditRefreshRefreshPostRequest {
    refreshToken: RefreshToken;
}

export interface RedditRevokeRevokePostRequest {
    token: Token;
}

export interface UpvotedUpvotedUsernameGetRequest {
    username: string;
}

/**
 * 
 */
export class RedditApi extends runtime.BaseAPI {

    /**
     * Callback after login to get access token
     */
    async redditAuthCallbackCallbackGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<OAuthToken>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/reddit/auth/callback`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => OAuthTokenFromJSON(jsonValue));
    }

    /**
     * Callback after login to get access token
     */
    async redditAuthCallbackCallbackGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<OAuthToken> {
        const response = await this.redditAuthCallbackCallbackGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Redirects to reddit login
     */
    async redditAuthGetRaw(requestParameters: RedditAuthGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters.returnTo !== undefined) {
            queryParameters['return_to'] = requestParameters.returnTo;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/reddit/auth/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Redirects to reddit login
     */
    async redditAuthGet(requestParameters: RedditAuthGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.redditAuthGetRaw(requestParameters, initOverrides);
    }

    /**
     * Submit a reddit post
     */
    async redditPostPostPostRaw(requestParameters: RedditPostPostPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SNSPostResponse>> {
        if (requestParameters.subreddit === null || requestParameters.subreddit === undefined) {
            throw new runtime.RequiredError('subreddit','Required parameter requestParameters.subreddit was null or undefined when calling redditPostPostPost.');
        }

        if (requestParameters.title === null || requestParameters.title === undefined) {
            throw new runtime.RequiredError('title','Required parameter requestParameters.title was null or undefined when calling redditPostPostPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwt", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.flair !== undefined) {
            formParams.append('flair', requestParameters.flair as any);
        }

        if (requestParameters.images) {
            requestParameters.images.forEach((element) => {
                formParams.append('images', element as any);
            })
        }

        if (requestParameters.subreddit !== undefined) {
            formParams.append('subreddit', requestParameters.subreddit as any);
        }

        if (requestParameters.text !== undefined) {
            formParams.append('text', requestParameters.text as any);
        }

        if (requestParameters.title !== undefined) {
            formParams.append('title', requestParameters.title as any);
        }

        const response = await this.request({
            path: `/api/reddit/post`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SNSPostResponseFromJSON(jsonValue));
    }

    /**
     * Submit a reddit post
     */
    async redditPostPostPost(requestParameters: RedditPostPostPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SNSPostResponse> {
        const response = await this.redditPostPostPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a new access token using the refresh token
     */
    async redditRefreshRefreshPostRaw(requestParameters: RedditRefreshRefreshPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<OAuthToken>> {
        if (requestParameters.refreshToken === null || requestParameters.refreshToken === undefined) {
            throw new runtime.RequiredError('refreshToken','Required parameter requestParameters.refreshToken was null or undefined when calling redditRefreshRefreshPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/reddit/auth/refresh`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RefreshTokenToJSON(requestParameters.refreshToken),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => OAuthTokenFromJSON(jsonValue));
    }

    /**
     * Get a new access token using the refresh token
     */
    async redditRefreshRefreshPost(requestParameters: RedditRefreshRefreshPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<OAuthToken> {
        const response = await this.redditRefreshRefreshPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Revoke an access token or refresh token
     */
    async redditRevokeRevokePostRaw(requestParameters: RedditRevokeRevokePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.token === null || requestParameters.token === undefined) {
            throw new runtime.RequiredError('token','Required parameter requestParameters.token was null or undefined when calling redditRevokeRevokePost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/reddit/auth/revoke`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TokenToJSON(requestParameters.token),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Revoke an access token or refresh token
     */
    async redditRevokeRevokePost(requestParameters: RedditRevokeRevokePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.redditRevokeRevokePostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async upvotedUpvotedUsernameGetRaw(requestParameters: UpvotedUpvotedUsernameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpvotedResponse>> {
        if (requestParameters.username === null || requestParameters.username === undefined) {
            throw new runtime.RequiredError('username','Required parameter requestParameters.username was null or undefined when calling upvotedUpvotedUsernameGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwt", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/reddit/upvoted/{username}`.replace(`{${"username"}}`, encodeURIComponent(String(requestParameters.username))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UpvotedResponseFromJSON(jsonValue));
    }

    /**
     */
    async upvotedUpvotedUsernameGet(requestParameters: UpvotedUpvotedUsernameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpvotedResponse> {
        const response = await this.upvotedUpvotedUsernameGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async userUserGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwt", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/reddit/user`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userUserGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userUserGetRaw(initOverrides);
        return await response.value();
    }

}
