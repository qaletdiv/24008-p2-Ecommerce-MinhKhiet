const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? 
  process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:4000';

const logo = `${IMAGE_BASE_URL}/images/logo.svg`;
const search_icon = `${IMAGE_BASE_URL}/images/search_icon.svg`;
const user_icon = `${IMAGE_BASE_URL}/images/user_icon.svg`;
const cart_icon = `${IMAGE_BASE_URL}/images/cart_icon.svg`;
const add_icon = `${IMAGE_BASE_URL}/images/add_icon.svg`;
const order_icon = `${IMAGE_BASE_URL}/images/order_icon.svg`;
const instagram_icon = `${IMAGE_BASE_URL}/images/instagram_icon.svg`;
const facebook_icon = `${IMAGE_BASE_URL}/images/facebook_icon.svg`;
const twitter_icon = `${IMAGE_BASE_URL}/images/twitter_icon.svg`;
const box_icon = `${IMAGE_BASE_URL}/images/box_icon.svg`;
const product_list_icon = `${IMAGE_BASE_URL}/images/product_list_icon.svg`;
const menu_icon = `${IMAGE_BASE_URL}/images/menu_icon.svg`;
const arrow_icon = `${IMAGE_BASE_URL}/images/arrow_icon.svg`;
const increase_arrow = `${IMAGE_BASE_URL}/images/increase_arrow.svg`;
const decrease_arrow = `${IMAGE_BASE_URL}/images/decrease_arrow.svg`;
const arrow_right_icon_colored = `${IMAGE_BASE_URL}/images/arrow_right_icon_colored.svg`;
const my_location_image = `${IMAGE_BASE_URL}/images/my_location_image.svg`;
const arrow_icon_white = `${IMAGE_BASE_URL}/images/arrow_icon_white.svg`;
const heart_icon = `${IMAGE_BASE_URL}/images/heart_icon.svg`;
const star_icon = `${IMAGE_BASE_URL}/images/star_icon.svg`;
const redirect_icon = `${IMAGE_BASE_URL}/images/redirect_icon.svg`;
const star_dull_icon = `${IMAGE_BASE_URL}/images/star_dull_icon.svg`;
const header_headphone_image = `${IMAGE_BASE_URL}/images/header_headphone_image.png`;
const header_playstation_image = `${IMAGE_BASE_URL}/images/header_playstation_image.png`;
const header_macbook_image = `${IMAGE_BASE_URL}/images/header_macbook_image.png`;
const macbook_image = `${IMAGE_BASE_URL}/images/macbook_image.png`;
const bose_headphone_image = `${IMAGE_BASE_URL}/images/bose_headphone_image.png`;
const apple_earphone_image = `${IMAGE_BASE_URL}/images/apple_earphone_image.png`;
const samsung_s23phone_image = `${IMAGE_BASE_URL}/images/samsung_s23phone_image.png`;
const venu_watch_image = `${IMAGE_BASE_URL}/images/venu_watch_image.png`;
const upload_area = `${IMAGE_BASE_URL}/images/upload_area.png`;
const cannon_camera_image = `${IMAGE_BASE_URL}/images/cannon_camera_image.png`;
const sony_airbuds_image = `${IMAGE_BASE_URL}/images/sony_airbuds_image.png`;
const asus_laptop_image = `${IMAGE_BASE_URL}/images/asus_laptop_image.png`;
const projector_image = `${IMAGE_BASE_URL}/images/projector_image.png`;
const playstation_image = `${IMAGE_BASE_URL}/images/playstation_image.png`;
const girl_with_headphone_image = `${IMAGE_BASE_URL}/images/girl_with_headphone_image.png`;
const girl_with_earphone_image = `${IMAGE_BASE_URL}/images/girl_with_earphone_image.png`;
const md_controller_image = `${IMAGE_BASE_URL}/images/md_controller_image.png`;
const sm_controller_image = `${IMAGE_BASE_URL}/images/sm_controller_image.png`;
const jbl_soundbox_image = `${IMAGE_BASE_URL}/images/jbl_soundbox_image.png`;
const boy_with_laptop_image = `${IMAGE_BASE_URL}/images/boy_with_laptop_image.png`;
const checkmark = `${IMAGE_BASE_URL}/images/checkmark.png`;
const product_details_page_apple_earphone_image1 = `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image1.png`;
const product_details_page_apple_earphone_image2 = `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image2.png`;
const product_details_page_apple_earphone_image3 = `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image3.png`;
const product_details_page_apple_earphone_image4 = `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image4.png`;
const product_details_page_apple_earphone_image5 = `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image5.png`;

export const assets = {
  logo,
  search_icon,
  user_icon,
  cart_icon,
  add_icon,
  order_icon,
  instagram_icon,
  facebook_icon,
  twitter_icon,
  box_icon,
  product_list_icon,
  menu_icon,
  arrow_icon,
  increase_arrow,
  decrease_arrow,
  arrow_right_icon_colored,
  my_location_image,
  arrow_icon_white,
  heart_icon,
  star_icon,
  redirect_icon,
  star_dull_icon,
  header_headphone_image,
  header_playstation_image,
  header_macbook_image,
  macbook_image,
  bose_headphone_image,
  apple_earphone_image,
  samsung_s23phone_image,
  venu_watch_image,
  upload_area,
  cannon_camera_image,
  sony_airbuds_image,
  asus_laptop_image,
  projector_image,
  playstation_image,
  girl_with_headphone_image,
  girl_with_earphone_image,
  md_controller_image,
  sm_controller_image,
  jbl_soundbox_image,
  boy_with_laptop_image,
  product_details_page_apple_earphone_image1,
  product_details_page_apple_earphone_image2,
  product_details_page_apple_earphone_image3,
  product_details_page_apple_earphone_image4,
  product_details_page_apple_earphone_image5,
  checkmark
};

export const BagIcon = () => {
  return (
    <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
    </svg>
  )
}

export const CartIcon = () => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.75 0.75H3.75L5.76 10.7925C5.82858 11.1378 6.01643 11.448 6.29066 11.6687C6.56489 11.8895 6.90802 12.0067 7.26 12H14.55C14.902 12.0067 15.2451 11.8895 15.5193 11.6687C15.7936 11.448 15.9814 11.1378 16.05 10.7925L17.25 4.5H4.5M7.5 15.75C7.5 16.1642 7.16421 16.5 6.75 16.5C6.33579 16.5 6 16.1642 6 15.75C6 15.3358 6.33579 15 6.75 15C7.16421 15 7.5 15.3358 7.5 15.75ZM15.75 15.75C15.75 16.1642 15.4142 16.5 15 16.5C14.5858 16.5 14.25 16.1642 14.25 15.75C14.25 15.3358 14.5858 15 15 15C15.4142 15 15.75 15.3358 15.75 15.75Z" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <rect width="18" height="18" fill="white" />
      </defs>
    </svg>
  )
}

export const BoxIcon = () => (
  <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 21v-9m3-4H7.5a2.5 2.5 0 1 1 0-5c1.5 0 2.875 1.25 3.875 2.5M14 21v-9m-9 0h14v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8ZM4 8h16a1 1 0 0 1 1 1v3H3V9a1 1 0 0 1 1-1Zm12.155-5c-3 0-5.5 5-5.5 5h5.5a2.5 2.5 0 0 0 0-5Z" />
  </svg>
);

export const HomeIcon = () => (
  <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
  </svg>
);

export const productsDummyData = [
  {
    "_id": "67a1f4e43f34a77b6dde9144",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Apple AirPods Pro 2nd gen",
    "description": "Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C) provide excellent sound, active noise cancellation, and a comfortable fit. The USB-C case ensures quick charging, and they pair seamlessly with Apple devices for an effortless audio experience.",
    "price": 499.99,
    "offerPrice": 399.99,
    "image": [
      `${IMAGE_BASE_URL}/images/apple_earphone_image.png`,
      `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image1.png`,
      `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image2.png`,
      `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image3.png`
    ],
    "category": "Earphone",
    "date": 1738667236865,
    "__v": 0
  },
  {
    "_id": "67a1f52e3f34a77b6dde914a",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Bose QuietComfort 45",
    "description": "The Bose QuietComfort 45 headphones are engineered for exceptional sound quality and unparalleled noise cancellation. With a 24-hour battery life and comfortable, lightweight design, these headphones deliver premium audio for any environment.",
    "price": 429.99,
    "offerPrice": 329.99,
    "image": [
      `${IMAGE_BASE_URL}/images/bose_headphone_image.png`
    ],
    "category": "Headphone",
    "date": 1738667310300,
    "__v": 0
  },
  {
    "_id": "67a1f5663f34a77b6dde914c",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Samsung Galaxy S23",
    "description": "The Samsung Galaxy S23 offers an all-encompassing mobile experience with its advanced AMOLED display, offering vibrant visuals and smooth interactions.",
    "price": 899.99,
    "offerPrice": 799.99,
    "image": [
      `${IMAGE_BASE_URL}/images/samsung_s23phone_image.png`
    ],
    "category": "Smartphone",
    "date": 1738667366224,
    "__v": 0
  },
  {
    "_id": "67a1f5993f34a77b6dde914e",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "Garmin Venu 2",
    "description": "The Garmin Venu 2 smartwatch blends advanced fitness tracking with sophisticated design, offering a wealth of features such as heart rate monitoring, GPS, and sleep tracking.",
    "price": 399.99,
    "offerPrice": 349.99,
    "image": [
      `${IMAGE_BASE_URL}/images/venu_watch_image.png`
    ],
    "category": "Smartwatch",
    "date": 1738667417511,
    "__v": 0
  },
  {
    "_id": "67a1f5ef3f34a77b6dde9150",
    "userId": "user_2sZFHS1UIIysJyDVzCpQhUhTIhw",
    "name": "PlayStation 5",
    "description": "The PlayStation 5 takes gaming to the next level with ultra-HD graphics, a powerful 825GB SSD, and ray tracing technology for realistic visuals.",
    "price": 599.99,
    "offerPrice": 499.99,
    "image": [
      `${IMAGE_BASE_URL}/images/playstation_image.png`
    ],
    "category": "Gaming",
    "date": 1738667471927,
    "__v": 0
  }
];