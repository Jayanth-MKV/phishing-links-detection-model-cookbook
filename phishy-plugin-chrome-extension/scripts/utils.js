async function getTabURL(){
    return chrome.runtime.getURL();
}

async function getPercentage(url){
    var formdata = new FormData();
  formdata.append("url", url);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

    try {
      const response = await fetch(
        "https://phishy.azurewebsites.net/",
        requestOptions
      );
        const data = await response.json();
        return data.prob_not_phishy;

    } catch (error) {
        console.error("Error while checking safeness:", error);
        return -1;
    }
  
}

// module.exports = {getPercentage}
export default getPercentage;