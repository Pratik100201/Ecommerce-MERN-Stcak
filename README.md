# Ecommerce-MERN-Stcak

## Description

An ecommerce store built with MERN stack, and utilizes third party API's. This ecommerce store enable three main different flows or implementations:

1. Buyers browse the store categories, products of different brands
2. Buyers can Buy products as Payment Gateway Integration also provided.
3. User Dashboard access where individual user can see all orders and their status.
4. Admin manage and control the entire store components
5. Create Product page where admin can create different products
6. Update Product page where admin can update exihisting product
7. All orders page where admin can manage status of the orbers

- features:
  - Node provides the backend environment for this application
  - Express middleware is used to handle requests, routes
  - Mongoose schemas to model the application data
  - React for displaying UI components and UseState , UseContext , UseEffect to manage different States


```
npm run seed:db [email-***@****.com] [password-******] // This is just an example.
```

## Demo

This application is deployed on Cyclic Please check it out :smile: [here](https://upset-gaiters-ray.cyclic.app).



## Install

Some basic Git commands are:

```
$ git clone https://github.com/Pratik100201/Ecommerce-MERN-Stcak.git
$ npm install
```

## Setup

```
 Create .env file that include:

  * MONGO_URI & JWT_SECRET
  * PORT 
  * SECRET_KEY
  * MERCHANT_ID 
  * PUBLIC_KEY 
  * PRIVATE_KEY
```

## Start development

```
$ npm run start
```

## Simple build for production

```
$ npm run build
```

## Run build for production

```
$ npm start
```

## Languages & tools

- [Node](https://nodejs.org/en/)

- [Express](https://expressjs.com/)

- [Mongoose](https://mongoosejs.com/)

- [React](https://reactjs.org/)



### Code Formatter

- Add a `.vscode` directory
- Create a file `settings.json` inside `.vscode`
- Install Prettier - Code formatter in VSCode
- Add the following snippet:

```json
{
  "editor.formatOnSave": true,
  "prettier.singleQuote": true,
  "prettier.arrowParens": "avoid",
  "prettier.jsxSingleQuote": true,
  "prettier.trailingComma": "none",
  "javascript.preferences.quoteStyle": "single"
}
```
