## Vizva Admin Panel
  
Admin Panel for [Vizva](https://github.com/boolien/Vizva).  

## [Click here](https://vizva-admin.vercel.app/) to preview the main branch.  

Preview link uses main branch. Please run npm run build locally first to make sure there aren't any build errors. Merging your branch with main will immidiately update the live link  

## Tech details

*   Interface built using Bootstrap and AdminLte.
*   Cloud functions/backend handled via [Moralis](https://moralis.io)  
    Read [Moralis Docs](https://docs.moralis.io/introduction/readme) for documentation.
*   Visit [Cloud function repository](https://github.com/boolien/Vizva_cloud) for more info on cloud functions
*   Visit [Frontend repository](https://github.com/boolien/Vizva) for more info on frontend app

## Run Locally

```bash
npm install # in project directory to install npm packages
npm update # some packages in package.json might have been updated
npm run dev # run dev server locally

# before merging with main, test for build errors
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.