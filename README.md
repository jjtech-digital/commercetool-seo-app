
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
   > Key features should be in the Markdown format as a list when we are adding them through editor.
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


# How to deploy using Connector

### Steps to follow:

## Create an Organization Connector

After developing your Connect applications, do the following:
1. From the Connect marketplace, click **Organization connectors**.

2. Click **Create connector**.

3. In the **Creator Details** section, follow these steps:
   * For Contact email, enter the contact email of the creator or maintainer of the Connector.
   * Optional: For **Title**, enter the title of the contact person.
   * Optional: For **Contact name**, enter the name of the contact person.
   * Optional: For **Company name**, enter the name of the company that created and maintains the Connector.
   * Optional: For **Number of developers**, enter the number of developers within the company.

4. In the **Connector Details** section, follow these steps:
   * For **Name**, enter the display name for the Connector.
   * Optional: For **Description**, enter a description for the Connector.
   * For **Repository URL**, enter the SSH URL of the GitHub repository containing your Connect applications.
   * For **Repository tag**, enter the Git tag of the release to use.
   * Optional: For **Connector key**, enter an identifier for the Connector.
   * Optional: For **Supported regions**, select the Regions in which the Connector will be available. If not selected, the Connector will be 
     available in all Regions supported by commercetools Connect.

5. In the **Project Details** section, follow these steps:
   * For **Primary project**, select the primary Project for the Connector.
   * For **Supported projects**, choose to make this Connector available to all or specific Projects within the Organization.

6. Click **Next**.

7. Optional: If you want to publish the Connector, select one of the options. To publish later, click Skip this step.
   * To publish a Connector for testing or debug purposes in your own Projects, click **Request Preview**.
   * To publish the Connector for use in your own Projects, click **Publish for private use**.
   * To submit your Connector to the certification process, click **List on Marketplace**. After the Connector is certified, it will be 
     listed on the Connect marketplace as a Public Connector.

8. The Manage connectors page appears, which displays your Organization Connectors.

## Publish an Organization Connector

Your Organization Connector must be published before it can be installed.

1. From the Connect marketplace, click Manage connectors.

2. On the Organization connectors tab, select a Connector from the list and choose one of the following:
   * Request preview: To publish your Connector for testing or debug purposes, click Request preview. After the Previewable status appears as Accepted, the Connector can be installed.
 
 > If the Previewable status appears as Rejected, you can view more information on the Preview Report tab of the Connector.
   * List on Marketplace: To list the Connector as a Public Connector, click List on Marketplace. This will submit your Connector to the certification process. After the Connector status appears as Listed and certified, your Connector will be listed on the Connect marketplace as a Public Connector.
   * Publish for private use: To publish the Connector for use in your own Projects, click Publish for private use. After the Connector status appears as Published, the Connector can be installed.
 
 > If the Connector status appears as Publish failed, you can view more information on the Publish Report tab of the Connector.

## Install an Organization Connector
You must create and publish an Organization Connector before it can be installed.

1. From the Connect marketplace, click Manage connectors.

2. On the Organization connectors tab, select the Connector to install.

3. If the Connector was published for testing purposes, click Deploy on Preview. If the Connector was published for private use, click Deploy on Production.

4. Select the Region in which you want to install the Connector.

5. When deploying on production: Choose to install the Connector for all Projects, or for specific Projects within your Organization, and click Next.

6. Enter the values for all fields for each application within the Connector.
> If you selected multiple Projects, you must repeat this process for each Project.

7. Click Install. The Manage connectors page appears, which displays the installation status.

- Open Manage connectors and click Installations. When the Status of the Connector is Installed, click the Connector and select your application from the list. Copy the value of the URL field. This is the URL where your Custom Application is deployed.

-  Update the Application URL of your Custom Application with the URL where your Custom Application is deployed.

## Thank you for using the AI-Driven Product MetaData Generator for commercetools!
