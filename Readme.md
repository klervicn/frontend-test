# Guidelines

- Clone this repo
- npm i
- npm start
- npm run electron-dev
- To upload a file, you can drag and drop it on the window, click, or add it manually in public/FHIR.

## Further dev

Here is a list of improvments for this app :

- Work with a designer to have a better UI, this one is ok and understandable but I think I can do better.
- Add the possibility of manage multiple files at the same time.
- Display more information about files (size, extension, modification date, etc).
- Prevent user from sending a file that is already on the server.
- Use foreman to manage processes and launch the web server and electron in one command.
- If the app become more complex (history, parameters, etc), it would be a good idea to use Redux to structure data flow.
- Use ipcrenderer on a higher level component. Here, I only need it in my FileDropzone.js, so I put it there, but in the future, I could need it in another component, so it's better if data came from the top.
- Use typescript, as type checking is a good first step for testing.
- Add tests, with Jest (for example), for components testing.
