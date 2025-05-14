const phoneCodes = [
    {
        "pais": "Afghanistan",
        "codigo": "+93",
        "codigo_pais": "AF",
        "longitud": 9
    },
    {
        "pais": "Albania",
        "codigo": "+355",
        "codigo_pais": "AL",
        "longitud": 9
    },
    {
        "pais": "Algeria",
        "codigo": "+213",
        "codigo_pais": "DZ",
        "longitud": 9
    },
    {
        "pais": "Andorra",
        "codigo": "+376",
        "codigo_pais": "AD",
        "longitud": 6
    },
    {
        "pais": "Angola",
        "codigo": "+244",
        "codigo_pais": "AO",
        "longitud": 9
    },
    {
        "pais": "Antigua and Barbuda",
        "codigo": "+1268",
        "codigo_pais": "AG",
        "longitud": 10
    },
    {
        "pais": "Argentina",
        "codigo": "+54",
        "codigo_pais": "AR",
        "longitud": 10
    },
    {
        "pais": "Armenia",
        "codigo": "+374",
        "codigo_pais": "AM",
        "longitud": 8
    },
    {
        "pais": "Australia",
        "codigo": "+61",
        "codigo_pais": "AU",
        "longitud": 9
    },
    {
        "pais": "Austria",
        "codigo": "+43",
        "codigo_pais": "AT",
        "longitud": 10
    },
    {
        "pais": "Azerbaijan",
        "codigo": "+994",
        "codigo_pais": "AZ",
        "longitud": 9
    },
    {
        "pais": "Bahamas",
        "codigo": "+1242",
        "codigo_pais": "BS",
        "longitud": 10
    },
    {
        "pais": "Bahrain",
        "codigo": "+973",
        "codigo_pais": "BH",
        "longitud": 8
    },
    {
        "pais": "Bangladesh",
        "codigo": "+880",
        "codigo_pais": "BD",
        "longitud": 10
    },
    {
        "pais": "Barbados",
        "codigo": "+1246",
        "codigo_pais": "BB",
        "longitud": 10
    },
    {
        "pais": "Belarus",
        "codigo": "+375",
        "codigo_pais": "BY",
        "longitud": 9
    },
    {
        "pais": "Belgium",
        "codigo": "+32",
        "codigo_pais": "BE",
        "longitud": 8
    },
    {
        "pais": "Belize",
        "codigo": "+501",
        "codigo_pais": "BZ",
        "longitud": 7
    },
    {
        "pais": "Benin",
        "codigo": "+229",
        "codigo_pais": "BJ",
        "longitud": 8
    },
    {
        "pais": "Bolivia, Plurinational State of",
        "codigo": "+591",
        "codigo_pais": "BO",
        "longitud": 8
    },
    {
        "pais": "Bosnia and Herzegovina",
        "codigo": "+387",
        "codigo_pais": "BA",
        "longitud": 8
    },
    {
        "pais": "Botswana",
        "codigo": "+267",
        "codigo_pais": "BW",
        "longitud": 8
    },
    {
        "pais": "Brazil",
        "codigo": "+55",
        "codigo_pais": "BR",
        "longitud": 10
    },
    {
        "pais": "Brunei Darussalam",
        "codigo": "+673",
        "codigo_pais": "BN",
        "longitud": 7
    },
    {
        "pais": "Bulgaria",
        "codigo": "+359",
        "codigo_pais": "BG",
        "longitud": 9
    },
    {
        "pais": "Burkina Faso",
        "codigo": "+226",
        "codigo_pais": "BF",
        "longitud": 8
    },
    {
        "pais": "Burundi",
        "codigo": "+257",
        "codigo_pais": "BI",
        "longitud": 8
    },
    {
        "pais": "Cabo Verde",
        "codigo": "+238",
        "codigo_pais": "CV",
        "longitud": 7
    },
    {
        "pais": "Cambodia",
        "codigo": "+855",
        "codigo_pais": "KH",
        "longitud": 8
    },
    {
        "pais": "Cameroon",
        "codigo": "+237",
        "codigo_pais": "CM",
        "longitud": 8
    },
    {
        "pais": "Canada",
        "codigo": "+1",
        "codigo_pais": "CA",
        "longitud": 10
    },
    {
        "pais": "Chile",
        "codigo": "+56",
        "codigo_pais": "CL",
        "longitud": 9
    },
    {
        "pais": "China",
        "codigo": "+86",
        "codigo_pais": "CN",
        "longitud": 11
    },
    {
        "pais": "Colombia",
        "codigo": "+57",
        "codigo_pais": "CO",
        "longitud": 10
    },
    {
        "pais": "Comoros",
        "codigo": "+269",
        "codigo_pais": "KM",
        "longitud": 7
    },
    {
        "pais": "Congo",
        "codigo": "+242",
        "codigo_pais": "CG",
        "longitud": 8
    },
    {
        "pais": "Congo, The Democratic Republic of the Congo",
        "codigo": "+243",
        "codigo_pais": "CD",
        "longitud": 9
    },
    {
        "pais": "Costa Rica",
        "codigo": "+506",
        "codigo_pais": "CR",
        "longitud": 8
    },
    {
        "pais": "Cote d'Ivoire",
        "codigo": "+225",
        "codigo_pais": "CI",
        "longitud": 8
    },
    {
        "pais": "Croatia",
        "codigo": "+385",
        "codigo_pais": "HR",
        "longitud": 9
    },
    {
        "pais": "Cuba",
        "codigo": "+53",
        "codigo_pais": "CU",
        "longitud": 8
    },
    {
        "pais": "Cyprus",
        "codigo": "+357",
        "codigo_pais": "CY",
        "longitud": 8
    },
    {
        "pais": "Denmark",
        "codigo": "+45",
        "codigo_pais": "DK",
        "longitud": 8
    },
    {
        "pais": "Djibouti",
        "codigo": "+253",
        "codigo_pais": "DJ",
        "longitud": 8
    },
    {
        "pais": "Dominica",
        "codigo": "+1767",
        "codigo_pais": "DM",
        "longitud": 7
    },
    {
        "pais": "Dominican Republic",
        "codigo": "+1849",
        "codigo_pais": "DO",
        "longitud": 10
    },
    {
        "pais": "Ecuador",
        "codigo": "+593",
        "codigo_pais": "EC",
        "longitud": 9
    },
    {
        "pais": "Egypt",
        "codigo": "+20",
        "codigo_pais": "EG",
        "longitud": 9
    },
    {
        "pais": "El Salvador",
        "codigo": "+503",
        "codigo_pais": "SV",
        "longitud": 8
    },
    {
        "pais": "Equatorial Guinea",
        "codigo": "+240",
        "codigo_pais": "GQ",
        "longitud": 8
    },
    {
        "pais": "Eritrea",
        "codigo": "+291",
        "codigo_pais": "ER",
        "longitud": 8
    },
    {
        "pais": "Estonia",
        "codigo": "+372",
        "codigo_pais": "EE",
        "longitud": 8
    },
    {
        "pais": "Ethiopia",
        "codigo": "+251",
        "codigo_pais": "ET",
        "longitud": 9
    },
    {
        "pais": "Fiji",
        "codigo": "+679",
        "codigo_pais": "FJ",
        "longitud": 7
    },
    {
        "pais": "Finland",
        "codigo": "+358",
        "codigo_pais": "FI",
        "longitud": 9
    },
    {
        "pais": "France",
        "codigo": "+33",
        "codigo_pais": "FR",
        "longitud": 9
    },
    {
        "pais": "Gabon",
        "codigo": "+241",
        "codigo_pais": "GA",
        "longitud": 7
    },
    {
        "pais": "Gambia",
        "codigo": "+220",
        "codigo_pais": "GM",
        "longitud": 7
    },
    {
        "pais": "Georgia",
        "codigo": "+995",
        "codigo_pais": "GE",
        "longitud": 9
    },
    {
        "pais": "Germany",
        "codigo": "+49",
        "codigo_pais": "DE",
        "longitud": 11
    },
    {
        "pais": "Ghana",
        "codigo": "+233",
        "codigo_pais": "GH",
        "longitud": 9
    },
    {
        "pais": "Greece",
        "codigo": "+30",
        "codigo_pais": "GR",
        "longitud": 10
    },
    {
        "pais": "Grenada",
        "codigo": "+1473",
        "codigo_pais": "GD",
        "longitud": 7
    },
    {
        "pais": "Guatemala",
        "codigo": "+502",
        "codigo_pais": "GT",
        "longitud": 8
    },
    {
        "pais": "Guinea",
        "codigo": "+224",
        "codigo_pais": "GN",
        "longitud": 8
    },
    {
        "pais": "Guinea-Bissau",
        "codigo": "+245",
        "codigo_pais": "GW",
        "longitud": 8
    },
    {
        "pais": "Guyana",
        "codigo": "+595",
        "codigo_pais": "GY",
        "longitud": 8
    },
    {
        "pais": "Haiti",
        "codigo": "+509",
        "codigo_pais": "HT",
        "longitud": 8
    },
    {
        "pais": "Honduras",
        "codigo": "+504",
        "codigo_pais": "HN",
        "longitud": 8
    },
    {
        "pais": "Hong Kong",
        "codigo": "+852",
        "codigo_pais": "HK",
        "longitud": 8
    },
    {
        "pais": "Hungary",
        "codigo": "+36",
        "codigo_pais": "HU",
        "longitud": 8
    },
    {
        "pais": "Iceland",
        "codigo": "+354",
        "codigo_pais": "IS",
        "longitud": 7
    },
    {
        "pais": "India",
        "codigo": "+91",
        "codigo_pais": "IN",
        "longitud": 10
    },
    {
        "pais": "Indonesia",
        "codigo": "+62",
        "codigo_pais": "ID",
        "longitud": 10
    },
    {
        "pais": "Iran, Islamic Republic of Persian Gulf",
        "codigo": "+98",
        "codigo_pais": "IR",
        "longitud": 10
    },
    {
        "pais": "Iraq",
        "codigo": "+964",
        "codigo_pais": "IQ",
        "longitud": 10
    },
    {
        "pais": "Ireland",
        "codigo": "+353",
        "codigo_pais": "IE",
        "longitud": 9
    },
    {
        "pais": "Isle of Man",
        "codigo": "+44",
        "codigo_pais": "IM",
        "longitud": 10
    },
    {
        "pais": "Israel",
        "codigo": "+972",
        "codigo_pais": "IL",
        "longitud": 9
    },
    {
        "pais": "Italy",
        "codigo": "+39",
        "codigo_pais": "IT",
        "longitud": 10
    },
    {
        "pais": "Jamaica",
        "codigo": "+1876",
        "codigo_pais": "JM",
        "longitud": 10
    },
    {
        "pais": "Japan",
        "codigo": "+81",
        "codigo_pais": "JP",
        "longitud": 10
    },
    {
        "pais": "Jordan",
        "codigo": "+962",
        "codigo_pais": "JO",
        "longitud": 9
    },
    {
        "pais": "Kazakhstan",
        "codigo": "+77",
        "codigo_pais": "KZ",
        "longitud": 10
    },
    {
        "pais": "Kenya",
        "codigo": "+254",
        "codigo_pais": "KE",
        "longitud": 9
    },
    {
        "pais": "Kiribati",
        "codigo": "+686",
        "codigo_pais": "KI",
        "longitud": 7
    },
    {
        "pais": "Korea, Democratic People's Republic of Korea",
        "codigo": "+850",
        "codigo_pais": "KP",
        "longitud": 8
    },
    {
        "pais": "Korea, Republic of South Korea",
        "codigo": "+82",
        "codigo_pais": "KR",
        "longitud": 9
    },
    {
        "pais": "Kuwait",
        "codigo": "+965",
        "codigo_pais": "KW",
        "longitud": 8
    },
    {
        "pais": "Kyrgyzstan",
        "codigo": "+996",
        "codigo_pais": "KG",
        "longitud": 9
    },
    {
        "pais": "Laos",
        "codigo": "+856",
        "codigo_pais": "LA",
        "longitud": 8
    },
    {
        "pais": "Latvia",
        "codigo": "+371",
        "codigo_pais": "LV",
        "longitud": 8
    },
    {
        "pais": "Lebanon",
        "codigo": "+961",
        "codigo_pais": "LB",
        "longitud": 8
    },
    {
        "pais": "Lesotho",
        "codigo": "+266",
        "codigo_pais": "LS",
        "longitud": 8
    },
    {
        "pais": "Liberia",
        "codigo": "+231",
        "codigo_pais": "LR",
        "longitud": 8
    },
    {
        "pais": "Libyan Arab Jamahiriya",
        "codigo": "+218",
        "codigo_pais": "LY",
        "longitud": 8
    },
    {
        "pais": "Liechtenstein",
        "codigo": "+423",
        "codigo_pais": "LI",
        "longitud": 8
    },
    {
        "pais": "Lithuania",
        "codigo": "+370",
        "codigo_pais": "LT",
        "longitud": 8
    },
    {
        "pais": "Luxembourg",
        "codigo": "+352",
        "codigo_pais": "LU",
        "longitud": 9
    },
    {
        "pais": "Macao",
        "codigo": "+853",
        "codigo_pais": "MO",
        "longitud": 8
    },
    {
        "pais": "Macedonia",
        "codigo": "+389",
        "codigo_pais": "MK",
        "longitud": 8
    },
    {
        "pais": "Madagascar",
        "codigo": "+261",
        "codigo_pais": "MG",
        "longitud": 9
    },
    {
        "pais": "Malawi",
        "codigo": "+265",
        "codigo_pais": "MW",
        "longitud": 9
    },
    {
        "pais": "Malaysia",
        "codigo": "+60",
        "codigo_pais": "MY",
        "longitud": 9
    },
    {
        "pais": "Maldives",
        "codigo": "+960",
        "codigo_pais": "MV",
        "longitud": 7
    },
    {
        "pais": "Mali",
        "codigo": "+223",
        "codigo_pais": "ML",
        "longitud": 8
    },
    {
        "pais": "Malta",
        "codigo": "+356",
        "codigo_pais": "MT",
        "longitud": 8
    },
    {
        "pais": "Mauritania",
        "codigo": "+222",
        "codigo_pais": "MR",
        "longitud": 8
    },
    {
        "pais": "Mauritius",
        "codigo": "+230",
        "codigo_pais": "MU",
        "longitud": 8
    },
    {
        "pais": "Mayotte",
        "codigo": "+262",
        "codigo_pais": "YT",
        "longitud": 8
    },
    {
        "pais": "Mexico",
        "codigo": "+52",
        "codigo_pais": "MX",
        "longitud": 10
    },
    {
        "pais": "Micronesia, Federated States of Micronesia",
        "codigo": "+691",
        "codigo_pais": "FM",
        "longitud": 9
    },
    {
        "pais": "Moldova",
        "codigo": "+373",
        "codigo_pais": "MD",
        "longitud": 8
    },
    {
        "pais": "Monaco",
        "codigo": "+377",
        "codigo_pais": "MC",
        "longitud": 8
    },
    {
        "pais": "Mongolia",
        "codigo": "+976",
        "codigo_pais": "MN",
        "longitud": 8
    },
    {
        "pais": "Montenegro",
        "codigo": "+382",
        "codigo_pais": "ME",
        "longitud": 8
    },
    {
        "pais": "Morocco",
        "codigo": "+212",
        "codigo_pais": "MA",
        "longitud": 9
    },
    {
        "pais": "Mozambique",
        "codigo": "+258",
        "codigo_pais": "MZ",
        "longitud": 9
    },
    {
        "pais": "Myanmar",
        "codigo": "+95",
        "codigo_pais": "MM",
        "longitud": 7
    },
    {
        "pais": "Namibia",
        "codigo": "+264",
        "codigo_pais": "NA",
        "longitud": 9
    },
    {
        "pais": "Nepal",
        "codigo": "+977",
        "codigo_pais": "NP",
        "longitud": 10
    },
    {
        "pais": "Netherlands",
        "codigo": "+31",
        "codigo_pais": "NL",
        "longitud": 9
    },
    {
        "pais": "New Zealand",
        "codigo": "+64",
        "codigo_pais": "NZ",
        "longitud": 9
    },
    {
        "pais": "Nicaragua",
        "codigo": "+505",
        "codigo_pais": "NI",
        "longitud": 8
    },
    {
        "pais": "Niger",
        "codigo": "+227",
        "codigo_pais": "NE",
        "longitud": 8
    },
    {
        "pais": "Nigeria",
        "codigo": "+234",
        "codigo_pais": "NG",
        "longitud": 10
    },
    {
        "pais": "Norway",
        "codigo": "+47",
        "codigo_pais": "NO",
        "longitud": 8
    },
    {
        "pais": "Oman",
        "codigo": "+968",
        "codigo_pais": "OM",
        "longitud": 8
    },
    {
        "pais": "Pakistan",
        "codigo": "+92",
        "codigo_pais": "PK",
        "longitud": 10
    },
    {
        "pais": "Panama",
        "codigo": "+507",
        "codigo_pais": "PA",
        "longitud": 8
    },
    {
        "pais": "Papua New Guinea",
        "codigo": "+675",
        "codigo_pais": "PG",
        "longitud": 8
    },
    {
        "pais": "Paraguay",
        "codigo": "+595",
        "codigo_pais": "PY",
        "longitud": 9
    },
    {
        "pais": "Peru",
        "codigo": "+51",
        "codigo_pais": "PE",
        "longitud": 9
    },
    {
        "pais": "Philippines",
        "codigo": "+63",
        "codigo_pais": "PH",
        "longitud": 10
    },
    {
        "pais": "Poland",
        "codigo": "+48",
        "codigo_pais": "PL",
        "longitud": 9
    },
    {
        "pais": "Portugal",
        "codigo": "+351",
        "codigo_pais": "PT",
        "longitud": 9
    },
    {
        "pais": "Qatar",
        "codigo": "+974",
        "codigo_pais": "QA",
        "longitud": 8
    },
    {
        "pais": "Romania",
        "codigo": "+40",
        "codigo_pais": "RO",
        "longitud": 10
    },
    {
        "pais": "Russia",
        "codigo": "+7",
        "codigo_pais": "RU",
        "longitud": 10
    },
    {
        "pais": "Rwanda",
        "codigo": "+250",
        "codigo_pais": "RW",
        "longitud": 9
    },
    {
        "pais": "Saint Kitts and Nevis",
        "codigo": "+1869",
        "codigo_pais": "KN",
        "longitud": 10
    },
    {
        "pais": "Saint Lucia",
        "codigo": "+1758",
        "codigo_pais": "LC",
        "longitud": 7
    },
    {
        "pais": "Saint Vincent and the Grenadines",
        "codigo": "+1784",
        "codigo_pais": "VC",
        "longitud": 7
    },
    {
        "pais": "Samoa",
        "codigo": "+685",
        "codigo_pais": "WS",
        "longitud": 8
    },
    {
        "pais": "San Marino",
        "codigo": "+378",
        "codigo_pais": "SM",
        "longitud": 8
    },
    {
        "pais": "Sao Tome and Principe",
        "codigo": "+239",
        "codigo_pais": "ST",
        "longitud": 7
    },
    {
        "pais": "Saudi Arabia",
        "codigo": "+966",
        "codigo_pais": "SA",
        "longitud": 9
    },
    {
        "pais": "Senegal",
        "codigo": "+221",
        "codigo_pais": "SN",
        "longitud": 9
    },
    {
        "pais": "Serbia",
        "codigo": "+381",
        "codigo_pais": "RS",
        "longitud": 8
    },
    {
        "pais": "Seychelles",
        "codigo": "+248",
        "codigo_pais": "SC",
        "longitud": 7
    },
    {
        "pais": "Sierra Leone",
        "codigo": "+232",
        "codigo_pais": "SL",
        "longitud": 8
    },
    {
        "pais": "Singapore",
        "codigo": "+65",
        "codigo_pais": "SG",
        "longitud": 8
    },
    {
        "pais": "Slovakia",
        "codigo": "+421",
        "codigo_pais": "SK",
        "longitud": 9
    },
    {
        "pais": "Slovenia",
        "codigo": "+386",
        "codigo_pais": "SI",
        "longitud": 8
    },
    {
        "pais": "Solomon Islands",
        "codigo": "+677",
        "codigo_pais": "SB",
        "longitud": 8
    },
    {
        "pais": "Somalia",
        "codigo": "+252",
        "codigo_pais": "SO",
        "longitud": 8
    },
    {
        "pais": "South Africa",
        "codigo": "+27",
        "codigo_pais": "ZA",
        "longitud": 9
    },
    {
        "pais": "South Sudan",
        "codigo": "+211",
        "codigo_pais": "SS",
        "longitud": 9
    },
    {
        "pais": "Spain",
        "codigo": "+34",
        "codigo_pais": "ES",
        "longitud": 9
    },
    {
        "pais": "Sri Lanka",
        "codigo": "+94",
        "codigo_pais": "LK",
        "longitud": 10
    },
    {
        "pais": "Sudan",
        "codigo": "+249",
        "codigo_pais": "SD",
        "longitud": 9
    },
    {
        "pais": "Suriname",
        "codigo": "+597",
        "codigo_pais": "SR",
        "longitud": 8
    },
    {
        "pais": "Swaziland",
        "codigo": "+268",
        "codigo_pais": "SZ",
        "longitud": 8
    },
    {
        "pais": "Sweden",
        "codigo": "+46",
        "codigo_pais": "SE",
        "longitud": 9
    },
    {
        "pais": "Switzerland",
        "codigo": "+41",
        "codigo_pais": "CH",
        "longitud": 9
    },
    {
        "pais": "Syrian Arab Republic",
        "codigo": "+963",
        "codigo_pais": "SY",
        "longitud": 9
    },
    {
        "pais": "Taiwan",
        "codigo": "+886",
        "codigo_pais": "TW",
        "longitud": 10
    },
    {
        "pais": "Tajikistan",
        "codigo": "+992",
        "codigo_pais": "TJ",
        "longitud": 9
    },
    {
        "pais": "Tanzania, United Republic of Tanzania",
        "codigo": "+255",
        "codigo_pais": "TZ",
        "longitud": 9
    },
    {
        "pais": "Thailand",
        "codigo": "+66",
        "codigo_pais": "TH",
        "longitud": 9
    },
    {
        "pais": "Timor-Leste",
        "codigo": "+670",
        "codigo_pais": "TL",
        "longitud": 8
    },
    {
        "pais": "Togo",
        "codigo": "+228",
        "codigo_pais": "TG",
        "longitud": 8
    },
    {
        "pais": "Tonga",
        "codigo": "+676",
        "codigo_pais": "TO",
        "longitud": 7
    },
    {
        "pais": "Trinidad and Tobago",
        "codigo": "+1868",
        "codigo_pais": "TT",
        "longitud": 10
    },
    {
        "pais": "Tunisia",
        "codigo": "+216",
        "codigo_pais": "TN",
        "longitud": 8
    },
    {
        "pais": "Turkey",
        "codigo": "+90",
        "codigo_pais": "TR",
        "longitud": 10
    },
    {
        "pais": "Turkmenistan",
        "codigo": "+993",
        "codigo_pais": "TM",
        "longitud": 9
    },
    {
        "pais": "Uganda",
        "codigo": "+256",
        "codigo_pais": "UG",
        "longitud": 9
    },
    {
        "pais": "Ukraine",
        "codigo": "+380",
        "codigo_pais": "UA",
        "longitud": 9
    },
    {
        "pais": "United Arab Emirates",
        "codigo": "+971",
        "codigo_pais": "AE",
        "longitud": 9
    },
    {
        "pais": "United Kingdom",
        "codigo": "+44",
        "codigo_pais": "GB",
        "longitud": 10
    },
    {
        "pais": "United States",
        "codigo": "+1",
        "codigo_pais": "US",
        "longitud": 10
    },
    {
        "pais": "Uruguay",
        "codigo": "+598",
        "codigo_pais": "UY",
        "longitud": 9
    },
    {
        "pais": "Uzbekistan",
        "codigo": "+998",
        "codigo_pais": "UZ",
        "longitud": 9
    },
    {
        "pais": "Vanuatu",
        "codigo": "+678",
        "codigo_pais": "VU",
        "longitud": 8
    },
    {
        "pais": "Venezuela, Bolivarian Republic of Venezuela",
        "codigo": "+58",
        "codigo_pais": "VE",
        "longitud": 10
    },
    {
        "pais": "Vietnam",
        "codigo": "+84",
        "codigo_pais": "VN",
        "longitud": 9
    },
    {
        "pais": "Zambia",
        "codigo": "+260",
        "codigo_pais": "ZM",
        "longitud": 9
    },
    {
        "pais": "Zimbabwe",
        "codigo": "+263",
        "codigo_pais": "ZW",
        "longitud": 9
    }
]

export default phoneCodes;