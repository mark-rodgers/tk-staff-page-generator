const parse = require("csv-parse");
const dropArea = document.getElementById("drop-area");

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

["dragenter", "dragover"].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("drop", e => {
  if(files = e.dataTransfer.files) {
    files[0].text()
      .then(text => {
        parse(text.trim(), { columns: true }, (err, records) => {
          if(err) {
            alert(err);
          }
          generateHTML(records);
        });
      })
      .catch(err => {
        alert(err);
      });
  }
});

function generateHTML(csv) {
  document.querySelector("#drop-area").remove();

  var preview = document.createElement("div");
  preview.classList.add("row");

  csv.forEach(row => {
    if(!preview.querySelector("." + machine(row.Header))) {
      var header = document.createElement("h2");
      header.textContent = row.Header;
      header.classList.add(machine(row.Header), "col-xs-12");
      // header.style.clear = "both";

      preview.append(header);
    }

    if(row.Subheader) {
      if(!preview.querySelector("." + machine(row.Subheader))) {
        var subheader = document.createElement("h4");
        subheader.textContent = row.Subheader;
        subheader.classList.add(machine(row.Subheader), "col-xs-12");
        // subheader.style.clear = "both";

        preview.append(subheader);
      }
    }

    var employee = document.createElement("div");
    employee.classList.add("col-lg-3", "col-sm-6", "col-xs-6");

    var imageURL = "https://esvadmin11.eschoolview.com/uploads/6DD71C25-FF99-4479-A342-1EE69FFF6B8C/placeholder.png";
    if(row.ImageURL) imageURL = row.ImageURL;

    var employeeImage = document.createElement("img");
    employeeImage.setAttribute("src", imageURL);
    employeeImage.setAttribute("alt", row.Name);
    employeeImage.style.height = "100px";
    employeeImage.style.margin = "0px 10px 20px 0px";
    employeeImage.style.border = "1px solid whitesmoke";
    employeeImage.style.float = "left";
    employee.append(employeeImage);

    var employeeParagraph = document.createElement("p");

    var employeeName = document.createElement("strong");
    employeeName.textContent = row.Name.trim();
    employeeParagraph.append(employeeName);

    if(row.Title) {
      employeeParagraph.append(document.createElement("br"));

      var employeeTitle = document.createElement("span");
      employeeTitle.textContent = row.Title.trim();
      employeeParagraph.append(employeeTitle);
    }

    if(row.Email || row.WebsiteURL) {
      employeeParagraph.append(document.createElement("br"));
      if(row.Email) {
        var employeeEmail = document.createElement("a");
        employeeEmail.textContent = "Email";
        employeeEmail.setAttribute("href", "mailto:" + row.Email.trim());
        employeeParagraph.append(employeeEmail);
        if(row.WebsiteURL) {
          var divider = document.createElement("span");
          divider.textContent = " / ";
          employeeParagraph.append(divider);
        }
      }
      if(row.WebsiteURL) {
        var employeeWebsite = document.createElement("a");
        employeeWebsite.textContent = "Website";
        employeeWebsite.setAttribute("href", row.WebsiteURL.trim());
        employeeWebsite.setAttribute("target", "_blank");
        employeeParagraph.append(employeeWebsite);
      }
    }
    employee.append(employeeParagraph);
    preview.append(employee);

    if(row.Break) {
      var dividerRow = document.createElement("div");
      dividerRow.classList.add("col-xs-12");
      dividerRow.style.marginBottom = "20px";

      var divider = document.createElement("hr");

      dividerRow.append(divider);
      preview.append(dividerRow);
    }
  });

  var sourceRow = document.createElement("div");
  sourceRow.classList.add("row");

  var source = document.createElement("textarea");
  source.textContent = preview.outerHTML.replace(/https:\/\/esvadmin11.eschoolview.com\//g, "/").trim();
  source.classList.add("col-xs-12");
  source.readOnly = true;
  sourceRow.append(source);

  var root = document.createElement("div");
  root.classList.add("container");
  root.append(sourceRow);
  root.append(preview);

  document.querySelector("body").append(root);
}

function machine(name) {
  return name.trim().toLowerCase().replace(/ /g,"-");
}

function highlight(e) {
  dropArea.classList.add("highlight")
}

function unhighlight(e) {
  dropArea.classList.remove("highlight")
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
