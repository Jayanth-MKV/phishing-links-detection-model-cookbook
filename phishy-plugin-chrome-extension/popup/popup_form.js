(() => {
    
    const handleReset = () => {
        
        
        const glow = document.getElementById("glow");
        glow.classList.add("placeholder");
        const load = document.getElementById("load");
        load.classList.remove("d-none");
        const symbol = document.getElementById("symbol");
        symbol.classList.add("d-none");

        const res = document.getElementById("result");
        res.classList.add("d-none");
    
        const sym_list = document.getElementById("symbol_list");
        sym_list.classList.add("d-none");
        console.log("RESET");
     };

    const submitForm = () => {
        const form = document.getElementById("report_form");
        // Add an event listener to the form's submit event
        form.addEventListener("submit", function (event) {
            // Prevent the default form submission behavior
        console.log("Inside FormSubmit");
        handleReset();
        event.preventDefault();
        const res = document.getElementById("result");
            res.classList.remove("d-none");
            
            const sym_list = document.getElementById("symbol_list");
            sym_list.classList.remove("d-none");
            
        // Get the form data
        const url = document.getElementById("exampleFormControlTextarea1").value;
        // document.getElementById("exampleFormControlTextarea1").value = "";
        if (url.length < 5) {
            const te = document.getElementById("toast_e");
            te.classList.add("show");
        } else {
            const formData = new FormData();
            formData.append("url", url);
            // Send the form data to the API endpoint using fetch
            fetch("https://phishy.azurewebsites.net/", {
                method: "POST",
                body: formData,
            })
            .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    const percent =
                      Math.round(
                        (result["prob_not_phishy"] * 100 + Number.EPSILON) * 100
                      ) / 100;
                    const per = document.getElementById("percent");
                    const glow = document.getElementById("glow");
                    const symbol = document.getElementById("symbol");
                    const load = document.getElementById("load");
                    const sym_text = symbol.children[0];
                    setTimeout(function () {
                        per.innerText = percent;
                        glow.classList.remove("placeholder");
                        
                        if (percent > 60) {
                            sym_text.classList.add("bg-success");
                            sym_text.innerText = "Safe to Go";
                        } else if (percent < 60 && percent > 20) {
                            sym_text.classList.add("bg-warning");
                            sym_text.innerText = "Be Careful";
                        } else {
                            sym_text.classList.add("bg-danger");
                            sym_text.innerText = "Phishy";
                        }
                        
                        symbol.classList.remove("d-none");
                        load.classList.add("d-none");
                    }, 500);
                    
                })
                .catch((error) => {
                    console.log("error", error);
                    const te = document.getElementById("toast_e");
                    te.classList.add("show");
                });
            }

      const te = document.getElementById("toast_e");
      const teb = document.getElementById("toast_eb");

            teb.addEventListener("click", (event) => {
              te.classList.remove("show");
            });
        });
    }

   
    const reset = () => {
        const reset = document.getElementById("reset");
        reset.addEventListener("click", handleReset);
    }

    function validateURL() {
      var inputURL = document.getElementById(
        "exampleFormControlTextarea1"
      ).value;
      var urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      var isValidURL = urlRegex.test(inputURL);
      if (!isValidURL) {
        document
          .getElementById("exampleFormControlTextarea1")
          .setCustomValidity("Please enter a valid URL");
      } else {
        document
          .getElementById("exampleFormControlTextarea1")
          .setCustomValidity("");
      }
    }

    const tb = document.getElementById("exampleFormControlTextarea1");
    tb.addEventListener("input", validateURL);

    reset(); 
    submitForm();
        

})();