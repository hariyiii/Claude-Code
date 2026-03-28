export interface Airport {
  rank: number;
  code: string;
  name: string;
  city: string;
  country: string;
  passengers: string;
  passengersNum: number;
  lng: number;
  lat: number;
}

// Top 10 busiest airports by passenger traffic (2023)
// Ordered from 10th to 1st place for the animation
export const airports: Airport[] = [
  {
    rank: 10,
    code: "DEL",
    name: "Indira Gandhi International",
    city: "Delhi",
    country: "India",
    passengers: "72.3M",
    passengersNum: 72_300_000,
    lng: 77.103,
    lat: 28.5562,
  },
  {
    rank: 9,
    code: "HND",
    name: "Tokyo Haneda",
    city: "Tokyo",
    country: "Japan",
    passengers: "73.4M",
    passengersNum: 73_400_000,
    lng: 139.7798,
    lat: 35.5494,
  },
  {
    rank: 8,
    code: "ORD",
    name: "O'Hare International",
    city: "Chicago",
    country: "USA",
    passengers: "74.0M",
    passengersNum: 74_000_000,
    lng: -87.9048,
    lat: 41.9742,
  },
  {
    rank: 7,
    code: "LAX",
    name: "Los Angeles International",
    city: "Los Angeles",
    country: "USA",
    passengers: "75.1M",
    passengersNum: 75_100_000,
    lng: -118.4085,
    lat: 33.9416,
  },
  {
    rank: 6,
    code: "IST",
    name: "Istanbul Airport",
    city: "Istanbul",
    country: "Turkey",
    passengers: "76.0M",
    passengersNum: 76_000_000,
    lng: 28.7519,
    lat: 41.2608,
  },
  {
    rank: 5,
    code: "DEN",
    name: "Denver International",
    city: "Denver",
    country: "USA",
    passengers: "77.8M",
    passengersNum: 77_800_000,
    lng: -104.6737,
    lat: 39.8561,
  },
  {
    rank: 4,
    code: "LHR",
    name: "Heathrow Airport",
    city: "London",
    country: "UK",
    passengers: "79.2M",
    passengersNum: 79_200_000,
    lng: -0.4614,
    lat: 51.47,
  },
  {
    rank: 3,
    code: "DFW",
    name: "Dallas/Fort Worth International",
    city: "Dallas",
    country: "USA",
    passengers: "81.8M",
    passengersNum: 81_800_000,
    lng: -97.038,
    lat: 32.8998,
  },
  {
    rank: 2,
    code: "DXB",
    name: "Dubai International",
    city: "Dubai",
    country: "UAE",
    passengers: "87.0M",
    passengersNum: 87_000_000,
    lng: 55.3644,
    lat: 25.2532,
  },
  {
    rank: 1,
    code: "ATL",
    name: "Hartsfield-Jackson Atlanta International",
    city: "Atlanta",
    country: "USA",
    passengers: "104.7M",
    passengersNum: 104_700_000,
    lng: -84.428,
    lat: 33.6407,
  },
];
