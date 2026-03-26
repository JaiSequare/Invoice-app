// Static Regex for Validations
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
export const zipRegex = /^[0-9]{6}$/;
export const textRegex = /^[A-Za-z]*$/;
export const decimalRegex = /^\d*\.?\d*$/;

// Change date format
export const formatDate = (date) => new Date(date)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ /g, "-")
    .toUpperCase();

// Convert object to formData
export const formatFormData = (obj) => {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
        formData.append(key, value);
    });
    return formData;
};

// Initial Login State
export const initialLoginState = {
    email: "",
    password: "",
    rememberMe: false
};

// Initial Signup states
export const initialSignupState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
    companyLogo: null,
    address: "",
    city: "",
    zipCode: "",
    industry: "",
    currencySymbol: ""
};

// Static Items states
export const initialItemState = {
    primaryKeyID: "",
    itemID: "",
    itemName: "",
    description: "",
    salesRate: "",
    discountPct: "",
    createdByUserName: "",
    createdOn: "",
    updatedByUserName: "",
    updatedOn: null
};

// Static Error messages
export const emptyEmailMsg = "Enter a valid email.";
export const invalidEmailMsg = "Please enter a valid email address.";

export const emptyPassMsg = "Enter your password.";
export const invalidPassMsg = "Password must be at least 8 characters and contain a number.";

export const emptyfnameMsg = "Please enter your first name.";
export const emptylnameMsg = "Please enter your last name.";
export const emptycompanynameMsg = "Please enter your company name.";
export const emptyaddressMsg = "Please enter company address.";
export const emptycityMsg = "Please enter city.";
export const emptyzipcodeMsg = "Please enter 6 digits zip.";
export const invalidzipcodeMsg = "Zip must be exactly 6 digits.";
export const emptycurrencyMsg = "Enter a valid currency symbol.";

export const emptyitemnameMsg = "Please enter item name.";
export const invaliditemnameMsg = "Item name Max 50 characters.";
export const emptysalerateMsg = "Enter a valid rate.";
export const invalidsalerateMsg = "Enter rate Must be greater then 0.";
export const invalidnumsalerateMsg = "Sales Rate must be a valid number.";
export const emptydiscountMsg = "Please select discount between 0 to 100 only.";

export const emptyInvoiceDateMsg = "Invoice date is required.";
export const emptyCustNameMsg = "Customer name is required.";
export const emptyInvNumMsg = "Invoice No must be a number.";
export const InvalidTaxMsg = "Tax cannot be negative.";
export const mex500Char = "Max 500 characters.";

// Pagination size counts
export const pageCount = [5, 10, 25];

// Allowed currency type only
export const allowedCurrencies = ['$', '₹', '€', 'AED'];

// Accepts images Types
export const imageType = ["image/png", "image/jpeg"];

// Invoice dynamic text feilds
export const initialLineItem = {
    rowNo: 0,
    item: '',
    description: '',
    quantity: 0,
    rate: 0,
    discountPct: 0,
    amount: 0,
};

// Initial  invoice data states
export const invoiceFormData = {
    invoiceNo: '',
    invoiceDate: '2025-01-15',
    customerName: '',
    city: '',
    address: '',
    notes: '',
    taxPercentage: 0,
};

// Invoice Line Items Values
export const lineItems = [
    { value: "itemA", name: "Item A" },
    { value: "itemB", name: "Item B" },
    { value: "itemC", name: "Item C" },
    { value: "itemD", name: "Item C" },
    { value: "itemE", name: "Item E" },
];

// Chart color static colors
export const colors = ["#1976d2", "#9c27b0", "#ff9800", "#4caf50", "#f44336"];



