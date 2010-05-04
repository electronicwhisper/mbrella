quick start:
  modify app/app.mbr to be your application
  run: script/compile
  test it in the browser with test/run.html


directory structure:

  app/
    this contains the code for the application you're making.
    the .mbr files are mbrella code, they get compiled into .js files

  doc/
    miscellaneous documentation

  interpreter/
    the code for the client-side browser-based interpreter
    this "interprets" (maybe virtual machine is a better name?) the compiled .js files (from the .mbr files)

  language/
    this is all the code specifying the language
    mbrella.txt is the ometa code specifying the language
      it gets compiled (by scripts/bootstrap.js) to mbrella.js
    mbrella.js then becomes a function that converts .mbr code to its json-y representation (ie: app.mbr -> app.js)

  script/
    shell is the v8 shell (via andrew)
    bootstrap.js compiles the _language_ (language/mbrella.txt -> language/mbrella.js)
    compile.js compiles the _app_ using language/mbrella.js (app/app.mbr -> app/app.js)

  support/
    is all third-party libraries that are used
    closure is google's javascript library, i use this for doing DOM manipulation
    js-beautify just spaces/indents javascript code
    ometa-js is ometa

  test/
    ometa-tester.html is just a temporary thing for figuring out ometa because the documentation is a bit sketchy
    run.html runs the app in app/app.js


