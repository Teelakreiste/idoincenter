# IDOINCENTER
This is a project for the PCSW (Project Construction Software) course at PJIC University.

This software consists of the implementation of an e-commerce system on the home hub.

It is developed using the Angular framework, the Google Firebase digital forms platform and Bootstrap for the front-end, and the Node.js framework for the back-end. It is a web application accessible from any device with an Internet connection. 

It is a system that allows the user to buy products, as well as to manage their own products and orders. It also allows the user to manage their personal information and the information of their products.

--- 

## Installation

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Firebase](https://firebase.google.com/)
- [Angular CLI](https://cli.angular.io/)

### Steps

1. Clone the repository 
```
 #   git clone https://github.com/Teelakreiste/EEIProject.git 
```
2. Install the dependencies with 
```
 #   npm install
```
3. Run the application with
```
 #   ng serve
```
4. Navigate to `http://localhost:4200/` in web browser.
Enjoy!

---

## Usage

In normal operation, the application will connect to the Firebase database. However, if you want to use your own database, you must create a new project in Firebase and replace the project configuration file with the one you have created.

### Firebase configuration

1. Create a new project in [Firebase](https://firebase.google.com/)
2. Create a new web application
3. Copy the configuration object
4. Paste the configuration object in the file `src/environments/environment.ts`
```
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```
5. Replace the configuration object in the file `src/environments/environment.prod.ts` with the same object
```
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

### Angular configuration

1. Navigate to the file `src/app/app.module.ts`
2. Replace the value of the `firebaseConfig` variable with the configuration object of your Firebase project

### Angular commands

- `ng serve` - Run the application in development mode
- `ng build` - Build the application for production
- `ng test` - Run the unit tests
- `ng e2e` - Run the end-to-end tests

### Angular creation commponents, services, etc.

- `ng generate component component-name` - Create a new component
- `ng generate service service-name` - Create a new service
- `ng generate class class-name` - Create a new class
- `ng generate interface interface-name` - Create a new interface
- `ng generate enum enum-name` - Create a new enum
- `ng generate module module-name` - Create a new module

---

## Libraries

- [Angular](https://angular.io/)
- [Firebase](https://firebase.google.com/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [Swiper](https://swiperjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [Angular Material](https://material.angular.io/)
- [ngx-print](https://www.npmjs.com/package/ngx-print)

## Documentation

- [Angular](https://angular.io/docs)
- [SweetAlert2](https://sweetalert2.github.io/#examples)
- [Firebase](https://firebase.google.com/docs)
- [Swiper](https://swiperjs.com/swiper-api)
- [Bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- [Font Awesome](https://fontawesome.com/how-to-use/on-the-web/referencing-icons/basic-use)
- [Angular Material](https://material.angular.io/components/categories)
- [ngx-print](https://www.npmjs.com/package/ngx-print)

---

## Screenshots
Below are some preview screenshots of the application's user interface


---

## Team members and Authors

Students of Computer Engineering at PJIC University.

- [Karen Mercado](https://github.com/KarenMercado "Karen Mercado")
- [Teelakreiste](https://github.com/Teelakreiste "Osmel Zuñiga")
- [Valentina Valencia](https://github.com/12valencia "Valentina Valencia")


---
## License
This project is open source and free to use.