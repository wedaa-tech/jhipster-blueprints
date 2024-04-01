package rest

import (
	app "<%= packageName %>/config/loader"
	"io"
	"net/http"
	"strings"
	"encoding/json"
	<%_ if (eureka){  _%>
	"github.com/ArthurHlt/go-eureka-client/eureka"
	<%_ } _%>
	"github.com/micro/micro/v3/service/logger"
)

type ResponseData struct {
		Body []byte
		Err  error
}

func Client(w http.ResponseWriter, req *http.Request, restServer string) {
	<%_ if (restServer?.length && eureka){  _%>
	eurekaUrl := app.GetVal("GO_MICRO_SERVICE_REGISTRY_URL")
	cleanUrl := strings.TrimSuffix(eurekaUrl, "/apps/")
	eurekaClient := eureka.NewClient([]string{cleanUrl})
	res, _ := eurekaClient.GetApplication(restServer)
	homePageURL := res.Instances[0].HomePageUrl
	serverUrl := homePageURL + "rest/services/" + restServer
	<%_ } else if((apiServers)){ _%>
	serverUrl :=app.GetVal("COMMUNICATION_"+strings.ToUpper(restServer)) + "/rest/services/"+restServer
	<%_ } _%>
	<%_ if (auth) { _%>
	client := &http.Client{
			Transport: &headerTransport{
				Transport: http.DefaultTransport,
				Header:    req.Header,
			},
		}
	<%_ } else { _%>
	client := &http.Client{}
	<%_ } _%>
	response, err := client.Get(serverUrl)
	if err != nil {
		logger.Errorf("Error sending GET request: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer response.Body.Close()

	if response.StatusCode >= 400 {
		errorMsg := "Internal Server Error"
		body, err := io.ReadAll(response.Body)
		if err == nil && len(body) > 0 {
			errorMsg = string(body)
		}
		logger.Errorf("Received error response with status code %d and error message: %s", response.StatusCode, errorMsg)
		http.Error(w, errorMsg, response.StatusCode)
		return
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		logger.Errorf("Error reading response body: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	var responseData map[string]interface{}
	if err := json.Unmarshal(body, &responseData); err != nil {
		logger.Errorf("Error decoding JSON response:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	jsonResponse, err := json.Marshal(responseData)
	if err != nil {
		logger.Errorf("Error encoding JSON response:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	logger.Infof("Response from server: %s", jsonResponse)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(response.StatusCode)
	w.Write(jsonResponse)
}


<%_ if (auth) { _%>
type headerTransport struct {
	Transport http.RoundTripper
	Header    http.Header
}

func (t *headerTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	token := t.Header.Get("Authorization")
	req.Header.Set("Authorization", token)
	return t.Transport.RoundTrip(req)
}
<%_ } _%>
