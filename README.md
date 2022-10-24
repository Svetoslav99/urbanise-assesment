This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Demo
Attached to this git repository you can find a demo.mkv file in which I am going through the main features.

## Getting Started
First, after installing dependancies, run in the root project terminal 'prisma generate' to generate ORM models that prisma.schema file defines.

### .env
Create your own .env file based on the .example.env.
for the 'DATABASE_URL' you can use this value: `'mongodb+srv://Svetoslav:BZSWwfxW2vjMWP9GN7gcTeWqFLU53E@urbanise.x8f8qco.mongodb.net/urbanise?retryWrites=true&w=majority'`

After that, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Folder structure

```
.
    ├── @types                        # Different typescript exported types used in the application.
    ├── components                    # React components with their 'module.scss' styling files.
         ├── features                 # Main features of the application are splitted in their own folder in here.
         ├── layout                   # Application layout react component.
         ├── ui                       # UI custom react components (e.g. Button, Form).
    ├── pages                         # Next.js specific folder that contains the routing of the application, as well as the api endpoints.
        ├── api                       # Contains application api endpoints 
        ├── ./...                     # Contains application routing index files.
    ├── prisma                        # ORM that is used to create database models and to help us with type safety.
    ├── public                        # Folder that contains image files used in the application.
    ├── styles                        # Contains global scss style files.
    ├── .example.env                  # Contains an example of '.env' keys and what values do they expect.
    └── demo-urbanise-assessment.mkv  # Demo video of the working application.
    
```

## Urbanise assessment
First, you shouldn’t spend more than 4-5 hours on this task. Not expecting anything fancy
with CSS at all - just make sure there is some simple layout.

* Create a SPA with two pages:
    * list of properties
    * property details page

* In the list, show the following fields:
    * property name
    * plan number
    * unit count
    * city
    * region
    * manager and
    * managed since

Allow for searching by name and plan number and for filtering by region.

In the details page show all available fields.

Make sure the properties can be edited, created and deleted.

You can either use a fake server/xhr library or simulate the BE responses in your service
layer.

The API looks as follows:
```
GET /api/properties/ returns:
[{
id: 0,
name: “name”,
plan: “plan number”,
units: 0,
city: “Sofia”,
region: 0,
manager: 0,
}]

GET /api/regions returns:
[{
id: 0,
name: “Queensland”,
}]

GET /api/manager/{id} returns:
{
id: {id},
firstName: “John”,
lastName: “Smith”,
managedSince: “2020-12-12”,
}

GET/PUT/DELETE /api/properties/{id} and POST /api/properties/ return:
{
id: 0,
name: “name”,
plan: “plan number”,
units: [{
id: 0,
lotAlpha: “1”,
floor: 0,
type: “Residential”,
}],
city: “Sofia”,
region: 0,
manager: 0,
previousManager: 0,
managementCompany: “Some Company”,
planRegistered: “2020-12-12”,
address: “address”,
account: “acc”,
abn: “ABN”,
}
```
