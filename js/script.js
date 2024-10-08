const fetchImage = async () => {
  const api_url = "https://api-hachuraservi1.websiteseguro.com/api/document";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic 96f9c92582aed580ba10a780e8af7fea57531c9c",
  };

  const body = new URLSearchParams({
    page: 1,
  });

  try {
    const response = await fetch(api_url, {
      method: "POST",
      headers,
      body,
    });

        // Acessando os cabeçalhos da resposta
        const responseHeaders = response.headers;
        console.log('Content-Type:', responseHeaders.get('content-type'));
        console.log('Authorization:', responseHeaders.get('authorization'));
        console.log('X-Requested-With:', responseHeaders.get('x-requested-with'));
        console.log('Access-Control-Allow-Headers:', responseHeaders.get('access-control-allow-headers'));
        console.log('Access-Control-Allow-Methods:', responseHeaders.get('access-control-allow-methods'));
        console.log('Access-Control-Allow-Origin:', responseHeaders.get('access-control-allow-origin'));
        console.log('Date:', responseHeaders.get('date'));
        console.log('Lw-X-Id:', responseHeaders.get('lw-x-id'));
        console.log('Server:', responseHeaders.get('server'));
        console.log('Total-Page:', responseHeaders.get('total_page'));
        console.log('X-Powered-By:', responseHeaders.get('x-powered-by'));
    
    const data = await response.json();
    updateImage(data.image)
  } catch (error) {
    console.log("error", error);
  } finally {

  }
};

fetchImage();

const updateImage = (image) => {
  const img = document.getElementById("image");
  img.src = image;
}
