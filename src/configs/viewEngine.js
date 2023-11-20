import express from "express";
import hbs from "hbs";
import fs from "fs";

// Assuming your __dirname is in the 'configs' directory
const partialsPath = __dirname + "/../views/partials"; // Adjust the path based on your project structure

const navbar = hbs.compile(
  fs.readFileSync(partialsPath + "/navbar.hbs").toString("utf-8")
);

let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.set("view engine", "hbs");
  app.set("views", "./src/views");

  hbs.registerPartial("navbar", navbar);
  /*hbs.registerHelper("pass_json", function (context) {
    return JSON.stringify(context);
  });*/
  hbs.registerHelper("pass_json", function (context) {
    return JSON.stringify(context);
  });

  hbs.registerHelper("check", function (variable, options) {
    if (variable && variable.length > 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hbs.registerHelper("cortarTexto", function (context) {
    if (Array.isArray(context) && context.length > 0) {
      return context.join(" ");
    } else {
      return "";
    }
  });
};

export default configViewEngine;
