# API Client ID/Secret Key Setup Instructions

> Assume Site is located at `https://github.com/jeffy-g/cerebral-web/docs/`

1. Visit [https://developers.eveonline.com](https://developers.eveonline.com) in your web browser.
2. Sign in with an EVE Online account, which account you use does not matter but it must have:
    * A verified email address.
    * Been paid for with a real world currency at least once in its lifetime (anything other than PLEX).
3. You may have to view and accept the developer license agreement, if prompted, please do so.
4. Go to [https://developers.eveonline.com/applications](https://developers.eveonline.com/applications)
5. Click **Create New Application**
6. Fill out the form as follows:
    * **Name**: Choose a name that you can easily identify, e.g - `Cerebral Web`
    * **Description**: Please enter a brief description, e.g - `Cerebral web application`
    * **CONNECTION TYPE**: this MUST BE **Authentication & API Access**
    * **PERMISSIONS**: Keep clicking on every permission in the **Available Scopes List** until all of the permissions are moved into the **Requested Scopes List**.
    * **CALLBACK URL**:
      + Enter the url where "callback/" is added to the url where the app page is located  
          e.g - **https://github.com/jeffy-g/cerebral-web/docs/callback/**

    Once you are finished it should look like this:

    ![create application screenshot](https://user-images.githubusercontent.com/26692481/83949541-68b0d400-a85f-11ea-9e96-717606fd2280.png)

7. Click **Create Application**.
8. Click **View Application** beside your newly created Cerebral application.
9. Copy and paste the provided **Client ID** into Cerebral's settings area and click Save.
    > No input is required because the authentication method does not require `Secret Key`

    > Regarding `EVE SSO Auth Redirect URI`, it is set automatically by recognizing the domain of server located in default
    > **If you need different settings, you need to enter the URI exactly**

![settings](https://user-images.githubusercontent.com/26692481/83949985-48cedf80-a862-11ea-8662-d8d260cb7c87.png)
