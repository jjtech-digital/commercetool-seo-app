
# AI-Driven Product MetaData Generator for commercetools

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-orange.svg)](https://sonarcloud.io/summary/new_code?id=jjtech-digital_commercetool-seo-app)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jjtech-digital_commercetool-seo-app&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jjtech-digital_commercetool-seo-app)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jjtech-digital_commercetool-seo-app&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jjtech-digital_commercetool-seo-app)
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=jjtech-digital_commercetool-seo-app)](https://sonarcloud.io/summary/new_code?id=jjtech-digital_commercetool-seo-app)


*Welcome to the AI-Driven Product Meta Generator for commercetools! This application uses OpenAI to effortlessly generate SEO titles, SEO descriptions, key features, and product descriptions for your products. With just a click of a button, you can create and update all your product metadata, saving you from manually typing long texts and ensuring better search engine rankings.*

## Features

### SEO Meta Data Generation
- **AI-Generated SEO Metadata**: Automatically generate SEO titles and descriptions for products using OpenAI.
- **Rules-Based Generation**: Define multiple rules in the settings page to guide the AI in generating metadata.
- **Single Product Generation**: Generate SEO metadata for individual products by clicking the "Generate" button in the product row.
- **Bulk Generation**: Select multiple products and generate SEO metadata for all of them at once using the "Generate" button outside of the table.
- **Editable Metadata**: Double-click on the SEO title and SEO description cells to edit the AI-generated metadata.
- **Update Commercetools**: Update the AI-generated metadata directly to the products in commercetools.
- **Select Language**: Select locales in the header and have the SEO details in multiple languages.

### Description & Key Features Generation
- **AI-Generated Description and Key Features**: Automatically generate description and key features for all products using OpenAI.
- **Rules-Based Generation**: Define multiple rules separately in the settings page to guide the AI in generating metadata as per requirement.
- **Single Product Generation**: Generate description and key features for individual products by clicking the "Generate" button in the product row.
- **Bulk Generation**: Select multiple products and generate description and key features for all of them at once using the "Generate" button outside of the table.
- **Editable Metadata**: Double-click on the description and key features cells to edit the AI-generated metadata.
- **Update Commercetools**: Update the AI-generated metadata directly to the products in commercetools by clicking on the Apply button for each product or in bulk.
- **Select Language**: Select locales in the header and have the product description and key features in multiple languages.

### Search Box
- **SEO Tab**: Search for products according to their key, name, SEO title or SEO description.
- **Description Tab**:  Search for products according to their key, name, description.


## Usage
### 1. Provide OpenAI Key:

- Go to the settings page and click on Open AI tab.
- Enter your OpenAI API key to enable SEO metadata generation.

### 2. Define Rules:

- Go to the settings page and click on the Rules tab.
- Define rules for generating SEO metadata, product description and key features to guide the AI.
  
https://github.com/user-attachments/assets/5b17963e-c034-44a9-8cf6-663c7f1b079e


### 3. Generate SEO Metadata: 

https://github.com/user-attachments/assets/2340fa0e-8666-44ef-b4c2-17eb62c2019e
- Go the the SEO tab through the toggle button

  #### Generate SEO Metadata for a *Single Product*:**

  - Find the product in the table.
  - Click the "Generate" button in the product row.

  #### Generate SEO Metadata for *Multiple Products*:

  - Select multiple products using the checkboxes.
  - Click the "Generate" button outside of the table on the top right.

  #### Edit AI-Generated Metadata:

  - Double-click on the SEO title or SEO description cell of a product.
  - Modify the text as needed.

  #### Update Metadata to commercetools:

  - Click the "Apply" button in the product row to update the metadata in commercetools.


### 4. Generate Description and Key Features: 
https://github.com/user-attachments/assets/be88188c-7a20-4e3d-bb80-c3187cc81f9d
 - Go to the Description tab through the toggle button

  #### Generate Description and Key Features for a *Single Product*:

  - Find the product in the table.
  - Click the "Generate" button in the product row.

  #### Generate Description and Key Features for *Multiple Products*:

  - Select multiple products using the checkboxes.
  - Click the "Generate" button outside of the table on the top right.

  #### Edit AI-Generated Metadata:

  - Double-click on the description or key features cell of a product.
  - Modify the text as needed.

  #### Update Metadata to commercetools:

  - Click the "Apply" button in the product row to update the metadata in commercetools.


## AWS Amplify Deployment 

### Step 1. Prepare your react application for production build : 

 - Make sure your React app is ready for production

         npm run build 

 - This will create a build (or dist or public) directory with your production-ready files.

### Step 2. Create an AWS Amplify App

- Log in to the [AWS Amplify Console.](https://aws.amazon.com/amplify/)
- Search for AWS Amplify in search bar and click on "create new app".
<img width="1400" alt="Screenshot 2024-08-13 at 5 11 21 PM" src="https://github.com/user-attachments/assets/84987b4d-65df-4950-a9a0-8cc7bb3c34e9">


### Step 3. Connect Your Repository

- **Choose a repository provider**: Select your Git provider(e.g., GitHub, GitLab, Bitbucket, AWS CodeCommit) and authorize AWS Amplify to access your repository.
<img width="1400" alt="Screenshot 2024-08-13 at 5 11 53 PM" src="https://github.com/user-attachments/assets/2235c14f-8001-4bde-a96c-82015012c9d2">

- **Select a repository**: Choose the repository and branch where your React app is stored.
<img width="1400" alt="Screenshot 2024-08-13 at 5 12 46 PM" src="https://github.com/user-attachments/assets/408ae2f6-4aba-4ad1-8fbd-d5c020525408">


- **Configure build settings**:
    - Amplify will automatically detect your React app and suggest a build configuration.
    - You can review or edit the build settings. If needed, you can specify the build command (npm run build) and the directory where the build output is located (build or dist or public).
<img width="1400" alt="Screenshot 2024-08-13 at 5 13 33 PM" src="https://github.com/user-attachments/assets/cf9bfe46-1970-4a5f-93e0-e489d6829270">


### Step 4. Configure App Settings
- **Environment variables**: If your React app requires environment variables, add them in the "Environment Variables" section.


### Step 5. Deploy the App
- **Deploy**: Click Save and deploy. AWS Amplify will build your app and deploy it to a globally available CDN (via Amazon CloudFront).
<img width="1400" alt="Screenshot 2024-08-13 at 5 14 19 PM" src="https://github.com/user-attachments/assets/789152fe-3d9b-42a5-8508-a1b88f1a2da2">

- **Monitor the deployment**: The Amplify Console will show the progress of your deployment. Once the deployment is complete, your app will be live.

This will deploy your custom application on AWS Amplify and provide you with a domain link.


## Installing A Custom Application
- Click the profile icon and select Manage Organizations & Teams.
<img width="1400" src="https://github.com/user-attachments/assets/3aa5941b-c83b-4b05-8e15-fff0fe9d52e1">

- Select the Organization for which you wish to install a Custom Application.
<img width="1400" src="https://github.com/user-attachments/assets/464980f8-71ea-4968-844a-c36890a981e1">

- Click the Custom Applications tab.
<img width="1400" src="https://github.com/user-attachments/assets/60c19803-a8ad-4c64-b2c7-639bdd2d210e">

- Click Manage project access. 

- Choose a Custom Application from the Ready for installation section.
<img width="1400" src="https://github.com/user-attachments/assets/9ac8a454-94f5-4adf-b598-c0b1df24ba56">

- Review the permissions listed in the Requested permissions section. A user must have at least View permission to access the Custom Application in the Merchant Center.

- In the Projects access section, grant Projects access by selecting one of the following options:

     - Install for all projects of this organization: grants access to all projects of an Organization.
     - Install for selected projects only: grants access only to selected projects of an Organization. To do so, select the Projects from the Select projects drop-down list.
     <img width="1400" src="https://github.com/user-attachments/assets/420df5d2-bd1f-42c0-956e-7b7ff8a0d3f2">

- Click Save.

You can now access the Custom Application within the respective Merchant Center Projects.


## Thank you for using the AI-Driven Product MetaData Generator for commercetools!
