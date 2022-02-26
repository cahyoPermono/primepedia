# Primepedia

## How I worked on this project
My goal was to make system to store our knowledge base and research about angular, webasembly, and firebase.
Details why this system needed
- When an employee first enters, it is difficult to pursue the knowledge he needs, they need to learn alone making slow learning curve. its happen in all fields(developer, hardware, sales and marketing, finance).
- employees also find it difficult to know our products in detail, like we have the smartmedia, primesaver and others but it's hard to find the documentation.
- resigned employees don't leave anything valuable (the sharing session is only for some people and is vulnerable to being lost).

## Why I built the project this way
- I didn't use a state management library like Ngrx on purpose. For this app simple `service` that could accessed globaly is
sufficient. I realized that using it very overkill for this project.
- TailwindCSS is a great library for styling. It utility class help we developer to not writing load of CSS.
- Firebase is fantastic for rapid prototyping, before i build backend myself i will stay with firebase for now. their services simplyfy many things
- Vercel well its very helpfull. deploying web app like a piece of cake and it automatically continue deployment whenever i push to git
- Testing is an essential part of production applications but for now i still not implement it yet.

## If I had more time I would change this
- Make tag and organize for all the video
- Make Backend so it should not dependent to firebase.
- Add end-to-end tests.

## Available Scripts

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## other lib
1. ngx-mask
2. angular fire / firebase
3. uuid (npm i uuid @types/uuid)
4. npm i @ffmpeg/ffmpeg @ffmpeg/core (experimental)
5. npm i @types/node -> ffmpeg harus dikasih ini biar typescript bisa baca
6. npm i video.js @types/video.js @videojs/themes untuk play video
7. npm i @tailwindcss/aspect-ratio untuk ngatur besaran size vvideo dengan mudah

## How to Deploy to server
1. set header for ffmpeg
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        }
      ]
    }
  ]
}