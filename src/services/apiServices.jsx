import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;
const controllerName = import.meta.env.VITE_API_CONTROLLERNAME;

// --------------------------- LOGIN /SIGNUP PAGE ---------------------------
// Login API
export const LoginApi = (payload) => {
    return axios.post(`${baseURL}/Auth/Login`, payload, {
        headers: {
            "Content-Type": "application/json",
        }
    });
};

// Signup API
export const RegisterApi = (payload) => {
    return axios.post(`${baseURL}/Auth/Signup`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};


// --------------------------- ITEMS PAGE ---------------------------
// Getting the items list API
export const GetItemsApi = (token) => {
    return axios.get(`${baseURL}/Item/GetList`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Get update modal items list API
export const GetUpdateModalApi = (token, id) => {
    return axios.get(`${baseURL}/Item/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Get thumbnail icon from item id
export const GetPictureThumbnailApi = (token, id) => {
    return axios.get(`${baseURL}/Item/PictureThumbnail/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Update thumbnail icon from item id
export const UpdatePictureThumbnailApi = (token, payload) => {
    return axios.post(`${baseURL}/${controllerName}/UpdateItemPicture`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Put Update modal items list API
export const UpdateEditModalApi = (payload, token) => {
    return axios.put(`${baseURL}/Item`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Add New modal items list API
export const AddNewModalApi = (payload, token) => {
    return axios.post(`${baseURL}/Item`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Delete modal items list API
export const DeleteModalApi = (token, id) => {
    return axios.delete(`${baseURL}/Item/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Export modal items list API
export const ExportItemApi = (token, payload) => {
    return axios.post(`${baseURL}/Item/export`, payload, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};


// --------------------------- DASHBOARD PAGE ---------------------------
// Dashboard all data fething API
export const getAllDashDataApi = (token, formdate) => {
    // return axios.get(`${baseURL}/Invoice/GetList?fromDate=${[formdate[0]]}&toDate=${[formdate[1]]}`, {
    return axios.get(`${baseURL}/Invoice/GetList?fromDate=2025-09-01&toDate=2025-10-01`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Dashboard all data fething API
export const getNetricesApi = (token) => {
    // for 13 month add formdate - ?fromDate=2024-09-01&toDate=2025-10-01
    // for 1 month add formdate - ?fromDate=2025-09-01&toDate=2025-10-01
    return axios.get(`${baseURL}/Invoice/GetMetrices`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Add New and Update Invoice in dashboard page
export const saveNewInvoiceApi = (token, payload, val) => {
    const checkVal = val?.toLowerCase() === 'new';
    return checkVal
        ? axios.post(`${baseURL}/Invoice/`, payload, {  //For New Invoice
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        : axios.put(`${baseURL}/Invoice/`, payload, { //For Update Invoice
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
};

// Get Single Invoice data for update in dashboard page from ID
export const fetchItemfromIdApi = (token, id) => {
    return axios.get(`${baseURL}/Invoice/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Delete Invoice in dashboard page
export const deleteInvoiceApi = (token, id) => {
    return axios.delete(`${baseURL}/Invoice/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};

// Get trending 12month Invoice data in dashboard page
export const getTrend12mApi = (token, dateVal) => {
    // return axios.delete(`${baseURL}/Invoice/GetTrend12m?asOf=${dateVal}`, {
    return axios.get(`${baseURL}/Invoice/GetTrend12m?asOf=2025-07-01`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
};
