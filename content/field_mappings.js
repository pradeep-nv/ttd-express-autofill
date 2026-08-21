/**
 * Field Mappings & Selectors for TTD Booking Portal
 * Targets: SED (Special Entry Darshan ₹300), Srivani Trust, Seva, Accommodation, Srivari Seva
 * Domains: ttdevasthanams.ap.gov.in, tirupatibalaji.ap.gov.in
 */

const TTD_FIELD_MAPPINGS = {
  // Common login / mobile verification
  auth: {
    mobileInput: [
      'input[formcontrolname="mobileNumber"]',
      'input[name="mobileNumber"]',
      '#mobileNumber',
      'input[placeholder*="Mobile"]'
    ],
    captchaInput: [
      'input[formcontrolname="captcha"]',
      'input[formcontrolname="captchaValue"]',
      'input[name="captcha"]',
      '#captcha',
      'input[placeholder*="Captcha" i]',
      'input[placeholder*="Enter Captcha" i]'
    ],
    generateOtpBtn: [
      'button[type="submit"]',
      'button.btn-primary:not([disabled])',
      'button:has-text("Generate OTP")',
      'button:has-text("Get OTP")'
    ],
    otpInput: [
      'input[formcontrolname="otp"]',
      'input[name="otp"]',
      '#otp',
      'input[placeholder*="OTP"]'
    ],
    loginBtn: [
      'button:has-text("Login")',
      'button:has-text("Verify OTP")'
    ]
  },

  // Special Entry Darshan (SED ₹300) & General Darshan Pilgrims
  darshan: {
    // Number of persons selector
    numPersonsSelect: [
      'select[formcontrolname="noOfPersons"]',
      'select[name="noOfPersons"]',
      '#noOfPersons',
      'mat-select[formcontrolname="noOfPersons"]'
    ],
    // Extra Laddus & Hundi
    extraLaddus: [
      'input[formcontrolname="extraLaddu"]',
      'input[formcontrolname="noOfExtraLaddus"]',
      '#extraLaddu',
      'input[name="extraLaddu"]'
    ],
    hundiAmount: [
      'input[formcontrolname="hundiAmount"]',
      'input[formcontrolname="donationAmount"]',
      '#hundiAmount'
    ],
    // Pilgrim Array Fields (index-based or formarray)
    pilgrim: {
      name: (index) => [
        `input[formcontrolname="name_${index}"]`,
        `input[formcontrolname="pilgrimName_${index}"]`,
        `input[name="name_${index}"]`,
        `#name_${index}`,
        `tr:nth-child(${index + 1}) input[formcontrolname="name"]`,
        `div.pilgrim-card:nth-child(${index + 1}) input[formcontrolname="name"]`,
        `input[placeholder*="Name" i]`
      ],
      age: (index) => [
        `input[formcontrolname="age_${index}"]`,
        `input[formcontrolname="pilgrimAge_${index}"]`,
        `input[name="age_${index}"]`,
        `#age_${index}`,
        `tr:nth-child(${index + 1}) input[formcontrolname="age"]`,
        `div.pilgrim-card:nth-child(${index + 1}) input[formcontrolname="age"]`,
        `input[placeholder*="Age" i]`
      ],
      gender: (index) => [
        `select[formcontrolname="gender_${index}"]`,
        `mat-select[formcontrolname="gender_${index}"]`,
        `#gender_${index}`,
        `tr:nth-child(${index + 1}) select[formcontrolname="gender"]`,
        `div.pilgrim-card:nth-child(${index + 1}) select[formcontrolname="gender"]`
      ],
      idProofType: (index) => [
        `select[formcontrolname="idProofType_${index}"]`,
        `mat-select[formcontrolname="idProofType_${index}"]`,
        `#idProofType_${index}`,
        `tr:nth-child(${index + 1}) select[formcontrolname="idProofType"]`,
        `div.pilgrim-card:nth-child(${index + 1}) select[formcontrolname="idProofType"]`
      ],
      idProofNumber: (index) => [
        `input[formcontrolname="idProofNumber_${index}"]`,
        `input[formcontrolname="idNumber_${index}"]`,
        `#idProofNumber_${index}`,
        `tr:nth-child(${index + 1}) input[formcontrolname="idProofNumber"]`,
        `div.pilgrim-card:nth-child(${index + 1}) input[formcontrolname="idProofNumber"]`,
        `input[placeholder*="ID" i]`
      ],
      state: (index) => [
        `select[formcontrolname="state_${index}"]`,
        `mat-select[formcontrolname="state_${index}"]`,
        `select[formcontrolname="state"]`,
        `#state_${index}`
      ],
      city: (index) => [
        `input[formcontrolname="city_${index}"]`,
        `input[formcontrolname="city"]`,
        `#city_${index}`
      ],
      fileUpload: (index) => [
        `input[type="file"][id*="file_${index}"]`,
        `tr:nth-child(${index + 1}) input[type="file"]`,
        `div.pilgrim-card:nth-child(${index + 1}) input[type="file"]`,
        `input[type="file"]`
      ]
    }
  },

  // Srivani Trust Donation Booking
  srivani: {
    donorName: [
      'input[formcontrolname="donorName"]',
      'input[name="donorName"]',
      '#donorName'
    ],
    donorAge: [
      'input[formcontrolname="donorAge"]',
      '#donorAge'
    ],
    donorGender: [
      'select[formcontrolname="donorGender"]',
      'mat-select[formcontrolname="donorGender"]'
    ],
    donorPan: [
      'input[formcontrolname="panNumber"]',
      'input[formcontrolname="pan"]',
      '#panNumber'
    ],
    donorAadhaar: [
      'input[formcontrolname="aadhaarNumber"]',
      '#aadhaarNumber'
    ],
    email: [
      'input[formcontrolname="email"]',
      '#email'
    ],
    address: [
      'textarea[formcontrolname="address"]',
      'input[formcontrolname="address"]',
      '#address'
    ],
    state: [
      'select[formcontrolname="state"]',
      'mat-select[formcontrolname="state"]'
    ],
    pinCode: [
      'input[formcontrolname="pincode"]',
      '#pincode'
    ]
  },

  // Accommodation
  accommodation: {
    locationSelect: [
      'select[formcontrolname="location"]',
      'mat-select[formcontrolname="location"]',
      '#location'
    ],
    roomType: [
      'select[formcontrolname="roomType"]',
      'mat-select[formcontrolname="roomType"]',
      '#roomType'
    ],
    numberOfDays: [
      'select[formcontrolname="noOfDays"]',
      '#noOfDays'
    ]
  },

  // General buttons & checkboxes
  global: {
    termsCheckbox: [
      'input[type="checkbox"][formcontrolname="agree"]',
      'input[type="checkbox"][formcontrolname="termsAndConditions"]',
      'input[type="checkbox"][name="agree"]',
      'input[type="checkbox"]#agree',
      'mat-checkbox input[type="checkbox"]'
    ],
    continueBtn: [
      'button[type="submit"]',
      'button:has-text("Continue")',
      'button:has-text("Proceed to Pay")',
      'button:has-text("Submit")',
      'button.btn-primary'
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TTD_FIELD_MAPPINGS;
}
