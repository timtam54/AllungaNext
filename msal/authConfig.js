const CLIENT_ID = "5a7e1820-1d77-41ee-9e80-97b144abca2b";//"f1c9e947-f6f9-4dd0-8e4c-5b2a0d840844";//"5a7e1820-1d77-41ee-9e80-97b144abca2b";//;
export const API_SCOPE ="api://efca4e54-fb09-4c7a-8208-b5fd4fce926f/tasks.read";// "api://efca4e54-fb09-4c7a-8208-b5fd4fce926f/tasks.read";
//https://lemon-forest-057aae100.5.azurestaticapps.net/
export const msalConfig = {
    auth: {
        clientId: '5a7e1820-1d77-41ee-9e80-97b144abca2b',//'33e7ac29-23cd-4184-897b-9d2a4132a4c3',//'f1c9e947-f6f9-4dd0-8e4c-5b2a0d840844',//'5a7e1820-1d77-41ee-9e80-97b144abca2b',//"f1c9e947-f6f9-4dd0-8e4c-5b2a0d840844",
        authority: 'https://login.microsoftonline.com/58f4e166-7a83-4d81-8e9d-05cf78a42ac0',//"https://login.microsoftonline.com/89ca7fa6-3d32-4432-8a0b-576cee1f6f43",//58f4e166-7a83-4d81-8e9d-05cf78a42ac0",//"https://login.microsoftonline.com/organizations/v2.0",//
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        scope: "tasks.read",
        domain: "YourDomain",
    },
    cache: {// Optional
        cacheLocation: 'localStorage',  // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false,  // Set this to "true" if you are having issues on IE11 or Edge
    },
};

export const loginRequest = {
    scopes:["api://efca4e54-fb09-4c7a-8208-b5fd4fce926f/tasks.read","tasks.read"],// ["api://cd5fd0c0-fa5d-496e-9d26-fda723aae74c/tasks.read","user.read"],//"api://efca4e54-fb09-4c7a-8208-b5fd4fce926f/tasks.read"
    //scopes: [API_SCOPE]
};

export const userDataLoginRequest = {
    scopes: ["user.read"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};