import axios from "axios";

const oak = JSON.parse(localStorage.getItem("oak-crypto") || "{}");

const api = axios.create({
  baseURL: "http://13.56.134.190:8086/v1/",
  headers: {
    "content-type": "application/json",
    // Authorization: "Basic " + btoa("rentpae:rentpae1234"),
  },
});

const apiGet = axios.create({
  baseURL: "http://13.56.134.190:8086/v1/",
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${oak.token}`,
  },
});
export class API {
  static getUrl(url: any) {
    return api({
      method: "GET",
      url: url,
    });
  }
  static common_api(api_name: any, opost: any) {
    return api({
      method: "POST",
      url: api_name,
      data: opost,
    });
  }
  static getUData(url: any) {
    return apiGet({
      method: "GET",
      url: url,
    });
  }
  static postData(api_name: any, opost: any) {
    return apiGet({
      method: "POST",
      url: api_name,
      data: opost,
    });
  }
}
